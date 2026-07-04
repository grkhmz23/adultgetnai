import { clearUserSessionCookie } from './_user-auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  res.setHeader('Set-Cookie', clearUserSessionCookie());
  res.status(200).json({ ok: true });
}
