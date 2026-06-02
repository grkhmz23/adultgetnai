import { createSessionCookie, isAuthConfigured, readJsonBody, safeEqual } from './_auth.js';

function getAcceptedPasswords() {
  return [
    process.env.INVESTOR_PASSWORD,
    ...(process.env.INVESTOR_PASSWORD_ALIASES || '')
      .split(',')
      .map((password) => password.trim())
      .filter(Boolean),
  ].filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  if (!isAuthConfigured()) {
    res.status(500).json({ ok: false, error: 'Auth is not configured' });
    return;
  }

  try {
    const { login = '', password = '' } = await readJsonBody(req);
    const submittedLogin = String(login).trim();
    const submittedPassword = String(password).trim();
    const valid =
      safeEqual(submittedLogin, process.env.INVESTOR_LOGIN.trim()) &&
      getAcceptedPasswords().some((acceptedPassword) =>
        safeEqual(submittedPassword, acceptedPassword)
      );

    if (!valid) {
      res.status(401).json({ ok: false });
      return;
    }

    res.setHeader('Set-Cookie', createSessionCookie());
    res.status(200).json({ ok: true });
  } catch {
    res.status(400).json({ ok: false });
  }
}
