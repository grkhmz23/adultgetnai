# API Contract

## `GET /api/google-login`

Starts Google OAuth. Sets short-lived HttpOnly state and PKCE cookies and redirects to Google.

## `GET /api/google-callback`

Validates state, exchanges the authorization code, verifies the ID token, creates the signed user
session, clears transient cookies, and redirects to `/chat`.

## `GET /api/user-session`

Returns `{ authenticated: false }` or `{ authenticated: true, user: { email, name, picture } }`.

## `POST /api/user-logout`

Clears the user session and returns `{ ok: true }`.

## `POST /api/chat`

Requires a valid user session. Accepts `{ messages, persona_id? }`, where messages contain only
`user` and `assistant` roles. Enforces bounded count and content lengths. Returns an OpenAI-compatible
chat-completion response plus optional AdultGen persona metadata.

Errors: `400` invalid request, `401` missing/invalid session, `429` rate limit, `500` missing server
configuration, `502` upstream failure, `504` upstream timeout.
