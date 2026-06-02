import { createSessionCookie, isAuthConfigured, readJsonBody, safeEqual } from './_auth.js';

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
    const valid =
      safeEqual(String(login), process.env.INVESTOR_LOGIN) &&
      safeEqual(String(password), process.env.INVESTOR_PASSWORD);

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

