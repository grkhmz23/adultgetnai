import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createOAuthAttempt,
  createUserSessionCookie,
  isOAuthStateValid,
  readOAuthAttempt,
  readUserSession,
} from '../api/_user-auth.js';
import googleLogin from '../api/google-login.js';

process.env.AUTH_SESSION_SECRET = 'test-session-secret-with-sufficient-entropy';
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';
process.env.APP_URL = 'http://127.0.0.1:3000';

function cookieHeader(setCookies) {
  return setCookies.map((cookie) => cookie.split(';')[0]).join('; ');
}

test('signed user session round-trips minimal Google identity', () => {
  const cookie = createUserSessionCookie({
    sub: 'google-user-123',
    email: 'USER@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.png',
  });
  const session = readUserSession(cookie.split(';')[0]);

  assert.deepEqual(session, {
    sub: 'google-user-123',
    email: 'user@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.png',
  });
});

test('tampered user session is rejected', () => {
  const cookie = createUserSessionCookie({
    sub: 'google-user-123',
    email: 'user@example.com',
    name: 'Test User',
  });
  const token = cookie.split(';')[0];
  assert.equal(readUserSession(`${token}tampered`), null);
});

test('OAuth attempt creates matching state and PKCE verifier cookies', () => {
  const attempt = createOAuthAttempt();
  const stored = readOAuthAttempt(cookieHeader(attempt.cookies));

  assert.equal(stored.state, attempt.state);
  assert.equal(stored.verifier, attempt.verifier);
  assert.equal(isOAuthStateValid(stored.state, attempt.state), true);
  assert.equal(isOAuthStateValid(stored.state, `${attempt.state}x`), false);
  assert.match(attempt.challenge, /^[A-Za-z0-9_-]+$/);
});

test('Google login starts state- and PKCE-protected authorization flow', () => {
  const result = { headers: {}, status: 0, location: '' };
  const response = {
    setHeader(name, value) {
      result.headers[name] = value;
    },
    status(code) {
      result.status = code;
      return this;
    },
    json() {},
    redirect(code, location) {
      result.status = code;
      result.location = location;
    },
  };

  googleLogin({ method: 'GET', headers: { host: '127.0.0.1:3000' } }, response);

  const location = new URL(result.location);
  assert.equal(result.status, 302);
  assert.equal(location.origin, 'https://accounts.google.com');
  assert.equal(location.searchParams.get('client_id'), 'google-client-id');
  assert.equal(location.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(location.searchParams.get('state'));
  assert.ok(location.searchParams.get('code_challenge'));
  assert.equal(result.headers['Set-Cookie'].length, 2);
  assert.ok(result.headers['Set-Cookie'].every((cookie) => cookie.includes('HttpOnly')));
});
