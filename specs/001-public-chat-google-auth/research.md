# Research Decisions

## Google identity

Use OAuth 2.0 authorization code flow with PKCE. Exchange the code server-side and verify the Google
ID token with Google JWKS through `jose`. This avoids trusting browser identity claims and avoids
placing the Google client secret in Vite assets.

## Session model

Use a dedicated signed `ag_user_session` HttpOnly cookie. Do not reuse the investor cookie because
investor access and public user identity have different privileges and lifetimes.

## Conversation persistence

Store conversations in localStorage with schema validation and recovery from malformed data. This
avoids retaining sensitive conversation content on AdultGen infrastructure in the initial release.

## Public model proxy

Create `/api/chat`, requiring the Google session and forwarding only sanitized messages to an
OpenAI-compatible backend. Reuse canonical safety/persona modules. Keep model URL and credentials
server-side. Add best-effort local rate limiting now and leave durable distributed limiting as an
AWS launch requirement.

## UI direction

Use the reference's app-shell composition, not its branding: persistent desktop sidebar, mobile
drawer, quiet empty state, centered composer, and bottom-pinned composer during conversation.
AdultGen retains its logo and restrained purple accent. Image/video tools remain disabled.
