import { isAuthConfigured, isSessionValid } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ authenticated: false });
    return;
  }

  if (!isAuthConfigured()) {
    res.status(200).json({ authenticated: false, configured: false });
    return;
  }

  res.status(200).json({
    authenticated: isSessionValid(req.headers.cookie || ''),
    configured: true,
  });
}

