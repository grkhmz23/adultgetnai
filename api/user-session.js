import { isUserAuthConfigured, readUserSession } from './_user-auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ authenticated: false });
    return;
  }

  const user = readUserSession(req.headers.cookie || '');
  res.status(200).json({
    authenticated: Boolean(user),
    configured: isUserAuthConfigured(),
    user: user
      ? { email: user.email, name: user.name, picture: user.picture }
      : null,
  });
}
