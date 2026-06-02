import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const cookieName = 'ag_session';
const maxAgeSeconds = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.INVESTOR_SESSION_SECRET || process.env.INVESTOR_PASSWORD || '';
}

function hash(value) {
  return createHash('sha256').update(value).digest();
}

export function safeEqual(a, b) {
  return timingSafeEqual(hash(a), hash(b));
}

function sign(payload) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createSessionCookie() {
  const payload = Buffer.from(
    JSON.stringify({
      sub: 'investor',
      exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
    })
  ).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  return `${cookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${secure}`;
}

export function clearSessionCookie() {
  return `${cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function isAuthConfigured() {
  return Boolean(
    process.env.INVESTOR_LOGIN &&
      process.env.INVESTOR_PASSWORD &&
      getSessionSecret()
  );
}

export function isSessionValid(cookieHeader = '') {
  const session = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);

  if (!session) return false;

  const [payload, signature] = session.split('.');
  if (!payload || !signature || signature !== sign(payload)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.sub === 'investor' && decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
