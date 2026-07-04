# Feature Specification: Public Chat and Google Authentication

**Feature Branch**: `feature/public-chat-google-auth`

**Created**: 2026-07-02

**Status**: In progress

**Input**: Keep the existing AdultGen landing page at `/`, create a ChatGPT-style chat product at
`/chat`, enable text chat for authenticated users, keep image and video generation inactive, and
prepare Google authentication before connecting the fine-tuned model hosted on AWS.

## User Scenarios & Testing

### User Story 1 - Enter the chat product (Priority: P1)

An adult visitor passes the existing age gate, opens `/chat`, and sees an AdultGen-branded,
responsive chat application rather than a marketing page.

**Why this priority**: This is the primary investor-visible product experience.

**Independent Test**: Open `/chat` on desktop and mobile and verify the app shell, empty state,
composer, navigation, and disabled future tools render without requiring a live model.

**Acceptance Scenarios**:

1. **Given** an age-approved visitor, **When** `/chat` opens, **Then** the AdultGen chat shell is shown.
2. **Given** a narrow viewport, **When** the sidebar is opened, **Then** it appears as a dismissible drawer.
3. **Given** the tool menu, **When** image or video is selected, **Then** no generation request occurs and the control communicates that it is coming soon.

### User Story 2 - Sign in with Google (Priority: P1)

An adult visitor signs in with Google before sending model requests.

**Why this priority**: Public model access cannot safely rely on shared investor credentials.

**Independent Test**: Exercise OAuth start, callback, session, and logout endpoints with mocked
Google responses and verify signed HttpOnly session behavior.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they choose Google sign-in, **Then** a state- and PKCE-protected OAuth flow begins.
2. **Given** a valid Google callback, **When** identity verification succeeds, **Then** a signed session is established and `/chat` opens.
3. **Given** an invalid state, code, token, or unverified email, **When** callback processing occurs, **Then** access is denied without creating a session.
4. **Given** an authenticated user, **When** logout is selected, **Then** the session cookie is cleared.

### User Story 3 - Hold a text conversation (Priority: P1)

An authenticated adult sends messages and receives AdultGen Companion responses through the
same-origin public API.

**Why this priority**: Text chat is the only live generation capability in this release.

**Independent Test**: Point the API to an OpenAI-compatible mock endpoint and verify message
validation, safety prompt insertion, response rendering, timeout behavior, and rate limits.

**Acceptance Scenarios**:

1. **Given** an authenticated user and healthy model backend, **When** a valid message is sent, **Then** the assistant response appears in the thread.
2. **Given** an unauthenticated user, **When** `/api/chat` is called, **Then** it returns `401`.
3. **Given** an unavailable model backend, **When** a message is sent, **Then** the UI preserves the user message and shows a retryable offline error.
4. **Given** prohibited input, **When** it is submitted, **Then** canonical server-side refusal logic is applied.

### User Story 4 - Manage private local conversations (Priority: P2)

An authenticated user creates, renames by first message, reopens, and deletes conversations stored
only in the current browser.

**Why this priority**: It provides familiar chat ergonomics without introducing sensitive server storage.

**Independent Test**: Create multiple conversations, reload the browser, reopen one, delete it,
and verify no chat content is sent to a persistence API.

**Acceptance Scenarios**:

1. **Given** a conversation, **When** the page reloads, **Then** it remains available from local history.
2. **Given** a deleted conversation, **When** history is refreshed, **Then** it no longer appears.

### Edge Cases

- OAuth is not configured in a development or preview environment.
- Google returns an account without a verified email.
- The AWS endpoint is unset, offline, slow, or returns malformed JSON.
- The user submits empty, oversized, or excessive messages.
- Browser storage is unavailable or full.
- A mobile browser opens its keyboard while the composer is pinned.
- A previous local chat contains malformed data after a schema change.

## Requirements

### Functional Requirements

- **FR-001**: The marketing homepage MUST remain at `/` without a visual redesign in this feature.
- **FR-002**: `/chat` MUST render a dedicated dark AdultGen chat application.
- **FR-003**: `/investor-demo` MUST remain protected by existing investor credentials.
- **FR-004**: Google OAuth MUST use authorization code flow, state validation, PKCE, and server-side identity-token verification.
- **FR-005**: User sessions MUST use signed HttpOnly cookies and expose only minimal profile data.
- **FR-006**: Public chat requests MUST require a valid Google user session.
- **FR-007**: Public chat MUST inject the canonical AdultGen system prompt server-side on every model request.
- **FR-008**: Public chat MUST enforce bounded history, per-message size, timeout, and best-effort rate limits.
- **FR-009**: Model configuration MUST remain compatible with an OpenAI-style AWS HTTPS endpoint.
- **FR-010**: Image and video controls MUST be visible but disabled and MUST NOT call an API.
- **FR-011**: Conversation history MUST be browser-local for this release and deletable by the user.
- **FR-012**: The interface MUST include loading, offline, retry, empty, authenticated, and unauthenticated states.
- **FR-013**: The age gate MUST continue to wrap `/chat` and all existing routes.
- **FR-014**: The implementation MUST remain local to the feature branch until AWS smoke tests pass.

### Key Entities

- **Authenticated User**: Google subject identifier, verified email, display name, optional avatar.
- **User Session**: Signed browser session containing minimal identity and expiry.
- **Conversation**: Browser-local identifier, title, timestamps, and ordered messages.
- **Chat Message**: Role, text content, creation time, and delivery state.
- **Model Request**: Bounded conversation context plus server-generated system instruction.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A first-time user can reach the Google sign-in action from `/chat` in one interaction after the age gate.
- **SC-002**: The chat app is usable without horizontal overflow at 375px, 768px, and 1440px viewport widths.
- **SC-003**: Image and video controls generate zero network requests in all interaction tests.
- **SC-004**: Invalid OAuth state and unauthenticated chat requests are rejected in 100% of automated cases.
- **SC-005**: Valid model responses render without layout shift and failed requests remain retryable.
- **SC-006**: Lint, production build, and focused authentication/chat tests pass before review.

## Assumptions

- Google OAuth credentials will be created before end-to-end OAuth testing.
- The AWS deployment will expose an HTTPS OpenAI-compatible `/v1/chat/completions` endpoint.
- Public launch concurrency is intentionally limited until inference capacity is measured.
- Server-side chat persistence, billing, image generation, and video generation are out of scope.
