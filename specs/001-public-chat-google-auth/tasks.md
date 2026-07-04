# Tasks: Public Chat and Google Authentication

## Phase 1: Foundation

- [x] T001 Add Google OAuth verification dependency and test script in `package.json`
- [x] T002 Implement signed public-user session and OAuth helpers in `api/_user-auth.js`
- [x] T003 [P] Add focused user-auth helper tests in `tests/user-auth.test.mjs`

## Phase 2: Google Authentication

- [x] T004 [US2] Implement OAuth start endpoint in `api/google-login.js`
- [x] T005 [US2] Implement OAuth callback endpoint in `api/google-callback.js`
- [x] T006 [P] [US2] Implement session endpoint in `api/user-session.js`
- [x] T007 [P] [US2] Implement logout endpoint in `api/user-logout.js`

## Phase 3: Public Chat API

- [x] T008 [US3] Implement bounded authenticated proxy in `api/chat.js`
- [x] T009 [P] [US3] Add public chat validation tests in `tests/public-chat.test.mjs`

## Phase 4: Chat Product UI

- [x] T010 [P] [US1] Implement browser-local conversation hook in `src/hooks/useLocalConversations.ts`
- [x] T011 [P] [US1] Implement responsive sidebar in `src/components/chat/ChatSidebar.tsx`
- [x] T012 [P] [US1] Implement Google sign-in state in `src/components/chat/GoogleSignIn.tsx`
- [x] T013 [P] [US1] Implement chat composer with disabled image/video controls in `src/components/chat/ChatComposer.tsx`
- [x] T014 [US1] Implement dedicated app shell and conversation thread in `src/pages/Chat.tsx`
- [x] T015 [US1] Route `/chat` to the public chat while retaining `/investor-demo` in `src/App.tsx`

## Phase 5: Verification

- [x] T016 Run focused tests, lint, and production build
- [ ] T017 Verify desktop/mobile empty, auth, conversation, disabled-tool, and offline states
- [x] T018 Document required Google/AWS environment variables and leave branch unpushed
