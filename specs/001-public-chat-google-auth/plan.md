# Implementation Plan: Public Chat and Google Authentication

**Branch**: `feature/public-chat-google-auth` | **Date**: 2026-07-02 | **Spec**: [spec.md](spec.md)

## Summary

Preserve the existing marketing homepage and create a dedicated dark chat application at `/chat`.
Authenticate public users through Google OAuth using server-side code exchange, PKCE, verified ID
tokens, and signed HttpOnly sessions. Add a bounded public chat proxy that reuses AdultGen safety
and persona logic and can later target an OpenAI-compatible AWS endpoint.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Node.js 20+

**Primary Dependencies**: React Router, Tailwind CSS, Lucide React, Vercel Functions, `jose`

**Storage**: Browser localStorage for chat history; signed cookies for sessions; no server chat database

**Testing**: Node built-in test runner for server helpers; ESLint; TypeScript/Vite production build

**Target Platform**: Modern desktop/mobile browsers and Vercel Node serverless functions

**Project Type**: Single Vite web application with same-repository serverless API routes

**Performance Goals**: Immediate shell render; bounded API payloads; 60-second upstream timeout

**Constraints**: Adult-only access, no public image/video generation, no backend URL in browser,
limited initial inference concurrency, no merge/deploy before AWS verification

**Scale/Scope**: Investor demo and controlled early public beta; tens of concurrent users initially

## Constitution Check

- Product truthfulness: PASS — inactive tools remain disabled.
- Adult safety/privacy: PASS — age gate, Google session, server prompt, local history.
- Server-enforced auth: PASS — OAuth state, PKCE, ID-token verification, HttpOnly cookie.
- Operational boundaries: PASS — same-origin proxy and bounded requests.
- Verification: PASS — focused helper tests plus lint/build.

## Project Structure

```text
api/
├── _user-auth.js
├── chat.js
├── google-callback.js
├── google-login.js
├── user-logout.js
└── user-session.js
src/
├── components/chat/
│   ├── ChatComposer.tsx
│   ├── ChatSidebar.tsx
│   └── GoogleSignIn.tsx
├── hooks/useLocalConversations.ts
├── pages/Chat.tsx
└── App.tsx
tests/
├── public-chat.test.mjs
└── user-auth.test.mjs
```

**Structure Decision**: Reuse the current Vite/Vercel repository boundaries. Keep investor auth and
public user auth separate to prevent privilege confusion.

## Delivery Gate

The feature remains on its local branch. Merge and production deployment require configured Google
credentials, an AWS model URL, a non-shared model authentication mechanism, and production smoke tests.
