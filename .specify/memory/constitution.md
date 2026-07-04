# AdultGen Frontend Constitution

## Core Principles

### I. Product Truthfulness
Public interfaces MUST distinguish live capabilities from roadmap capabilities. Chat may be
presented as live only when its health check passes. Image and video generation MUST remain
disabled and labelled as unavailable until their production backends exist.

### II. Adult Safety and Privacy
The age gate MUST precede product access. Public chat MUST require authenticated adult users,
enforce the canonical AdultGen safety prompt server-side, avoid exposing backend credentials,
and avoid storing sensitive chat content on AdultGen servers by default.

### III. Server-Enforced Authentication
Google identity MUST be verified server-side. Sessions MUST use signed, HttpOnly, Secure,
SameSite cookies. OAuth state and PKCE MUST protect the authorization flow. Client claims MUST
never be trusted as proof of identity.

### IV. Operational Boundaries
The browser MUST call same-origin Vercel API routes. Model URLs, provider secrets, and system
prompts MUST remain server-side. Public model requests MUST have size, history, timeout, and
rate limits suitable for a constrained inference backend.

### V. Focused Verification
Authentication, session parsing, request validation, and chat behavior changes MUST receive
focused automated tests. Every feature branch MUST pass lint and production build before review.

## Product Constraints

The existing marketing homepage remains at `/`. Public chat lives at `/chat`; the investor demo
remains at `/investor-demo`. Google OAuth and the chat API may be prepared before the AWS model
is deployed, but the feature MUST NOT be merged or deployed until end-to-end production smoke
tests pass against the AWS endpoint.

## Development Workflow

Material work occurs on a feature branch. No push to `main` and no production deployment occurs
without explicit user approval. Existing unrelated working-tree changes are preserved.

## Governance

This constitution governs the public chat and authentication feature. Amendments require a
documented reason, updated feature artifacts, and re-validation of security and product claims.

**Version**: 1.0.0 | **Ratified**: 2026-07-02 | **Last Amended**: 2026-07-02
