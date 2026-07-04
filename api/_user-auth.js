import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const sessionCookieName = 'ag_user_session';
const stateCookieName = 'ag_oauth_state';
const verifierCookieName = 'ag_oauth_verifier';
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;
const oauthMaxAgeSeconds = 60 * 10;
const googleJwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET || '';
}

function secureSuffix() {
  return process.env.NODE_ENV === 'production' ? '; Secure' : '';
}

function hash(value) {
  return createHash('sha256').update(String(value)).digest();
}

function safeEqual(left, right) {
  return timingSafeEqual(hash(left), hash(right));
}

function sign(payload) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const separator = item.indexOf('=');
        if (separator === -1) return [item, ''];
        return [item.slice(0, separator), decodeURIComponent(item.slice(separator + 1))];
      })
  );
}

function cleanUser(user) {
  return {
    sub: String(user.sub || '').slice(0, 255),
    email: String(user.email || '').toLowerCase().slice(0, 320),
    name: String(user.name || user.email || 'AdultGen user').slice(0, 120),
    picture: String(user.picture || '').slice(0, 1000),
  };
}

export function isUserAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      getSessionSecret()
  );
}

export function createUserSessionCookie(user) {
  const clean = cleanUser(user);
  const payload = Buffer.from(
    JSON.stringify({
      ...clean,
      exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds,
    })
  ).toString('base64url');

  return `${sessionCookieName}=${payload}.${sign(payload)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAgeSeconds}${secureSuffix()}`;
}

export function clearUserSessionCookie() {
  return `${sessionCookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureSuffix()}`;
}

export function readUserSession(cookieHeader = '') {
  if (!getSessionSecret()) return null;

  const token = parseCookies(cookieHeader)[sessionCookieName];
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.sub || !decoded.email || decoded.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return cleanUser(decoded);
  } catch {
    return null;
  }
}

export function createOAuthAttempt() {
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const suffix = `HttpOnly; SameSite=Lax; Path=/; Max-Age=${oauthMaxAgeSeconds}${secureSuffix()}`;

  return {
    state,
    verifier,
    challenge,
    cookies: [
      `${stateCookieName}=${state}; ${suffix}`,
      `${verifierCookieName}=${verifier}; ${suffix}`,
    ],
  };
}

export function readOAuthAttempt(cookieHeader = '') {
  const cookies = parseCookies(cookieHeader);
  return {
    state: cookies[stateCookieName] || '',
    verifier: cookies[verifierCookieName] || '',
  };
}

export function clearOAuthCookies() {
  const suffix = `HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureSuffix()}`;
  return [
    `${stateCookieName}=; ${suffix}`,
    `${verifierCookieName}=; ${suffix}`,
  ];
}

export function isOAuthStateValid(expected, submitted) {
  return Boolean(expected && submitted && safeEqual(expected, submitted));
}

export function getRequestOrigin(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const protocol = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000')
    .split(',')[0]
    .trim();
  return `${protocol}://${host}`;
}

export function getGoogleRedirectUri(req) {
  return (
    process.env.GOOGLE_REDIRECT_URI || `${getRequestOrigin(req)}/api/google-callback`
  );
}

export async function verifyGoogleIdToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !idToken) throw new Error('Google authentication is not configured');

  const { payload } = await jwtVerify(idToken, googleJwks, {
    audience: clientId,
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
  });

  if (!payload.sub || !payload.email || payload.email_verified !== true) {
    throw new Error('Google account email is not verified');
  }

  return cleanUser(payload);
}

export const userAuthConstants = {
  sessionCookieName,
  stateCookieName,
  verifierCookieName,
};
