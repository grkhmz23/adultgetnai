import {
  clearOAuthCookies,
  createUserSessionCookie,
  getGoogleRedirectUri,
  getRequestOrigin,
  isOAuthStateValid,
  isUserAuthConfigured,
  readOAuthAttempt,
  verifyGoogleIdToken,
} from './_user-auth.js';

function redirectWithError(res, origin, code) {
  res.setHeader('Set-Cookie', clearOAuthCookies());
  res.redirect(302, `${origin}/chat?auth_error=${encodeURIComponent(code)}`);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ ok: false });
    return;
  }

  const origin = getRequestOrigin(req);
  if (!isUserAuthConfigured()) {
    redirectWithError(res, origin, 'not_configured');
    return;
  }

  const submittedState = String(req.query?.state || '');
  const code = String(req.query?.code || '');
  const providerError = String(req.query?.error || '');
  const attempt = readOAuthAttempt(req.headers.cookie || '');

  if (providerError || !code || !attempt.verifier || !isOAuthStateValid(attempt.state, submittedState)) {
    redirectWithError(res, origin, providerError || 'invalid_callback');
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: 'authorization_code',
        code_verifier: attempt.verifier,
      }),
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.id_token) {
      throw new Error('Google token exchange failed');
    }

    const user = await verifyGoogleIdToken(tokenData.id_token);
    res.setHeader('Set-Cookie', [
      ...clearOAuthCookies(),
      createUserSessionCookie(user),
    ]);
    res.redirect(302, `${origin}/chat`);
  } catch (error) {
    console.error('[google-callback]', error instanceof Error ? error.message : 'unknown error');
    redirectWithError(res, origin, 'verification_failed');
  }
}
