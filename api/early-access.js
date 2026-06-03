import { readJsonBody } from './_auth.js';

const contactEmail = 'info@adultgen.fun';
const maxFieldLength = 4000;

function clean(value) {
  return String(value || '').trim().slice(0, maxFieldLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildMailtoHref({ name, email, message }) {
  const subject = encodeURIComponent('AdultGen AI Early Access');
  const body = encodeURIComponent(
    [
      'Hi AdultGen AI,',
      '',
      "I'd like to request early access.",
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n')
  );

  return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
}

function buildEmailHtml({ name, email, message }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#121212">
      <h1 style="font-size:20px;margin:0 0 16px">AdultGen AI early access request</h1>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const name = clean(body.name);
    const email = clean(body.email);
    const message = clean(body.message);
    const companyWebsite = clean(body.companyWebsite);

    if (companyWebsite) {
      res.status(200).json({ ok: true });
      return;
    }

    if (!name || !email || !message || !isValidEmail(email)) {
      res.status(400).json({ ok: false, error: 'Enter a valid name, email, and message.' });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.EARLY_ACCESS_TO_EMAIL || contactEmail;
    const from = process.env.EARLY_ACCESS_FROM_EMAIL;

    if (!apiKey || !from) {
      res.status(501).json({
        ok: false,
        error: 'Email delivery is not configured yet.',
        mailtoHref: buildMailtoHref({ name, email, message }),
      });
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `AdultGen AI early access request from ${name}`,
        html: buildEmailHtml({ name, email, message }),
        text: [
          'AdultGen AI early access request',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          '',
          'Message:',
          message,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('[early-access] email provider failed', details);
      res.status(502).json({ ok: false, error: 'Email provider failed. Please try again.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[early-access] request failed', error);
    res.status(500).json({ ok: false, error: 'Request could not be sent.' });
  }
}
