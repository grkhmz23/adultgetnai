import {
  createOAuthAttempt,
  getGoogleRedirectUri,
  isUserAuthConfigured,
} from './_user-auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ ok: false });
    return;
  }

  if (!isUserAuthConfigured()) {
    res.status(503).json({ ok: false, error: 'Google authentication is not configured' });
    return;
  }

  const attempt = createOAuthAttempt();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(req),
    response_type: 'code',
    scope: 'openid email profile',
    state: attempt.state,
    code_challenge: attempt.challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  });

  res.setHeader('Set-Cookie', attempt.cookies);
  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
