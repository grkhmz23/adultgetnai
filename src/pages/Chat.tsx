import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Heart,
  MessageCircle,
  MessageSquarePlus,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import ChatComposer from '../components/chat/ChatComposer';
import ChatSidebar from '../components/chat/ChatSidebar';
import GoogleSignIn from '../components/chat/GoogleSignIn';
import { bubblesFromAssistantMessage } from '../lib/chatBubbles';
import {
  createLocalMessage,
  useLocalConversations,
} from '../hooks/useLocalConversations';
import type { LocalChatMessage } from '../hooks/useLocalConversations';
import { usePageMeta } from '../hooks/use-page-meta';

type SessionUser = {
  email: string;
  name: string;
  picture?: string;
};

type CompletionResponse = {
  choices?: Array<{
    message?: { content?: string; bubbles?: string[] };
  }>;
  error?: string;
};

const suggestions = [
  { label: 'Choose a fictional companion', icon: MessageCircle },
  { label: 'Start a private romantic chat', icon: Heart },
  { label: 'Create a safe scene concept', icon: WandSparkles },
];

function authErrorMessage(code: string | null) {
  if (!code) return '';
  if (code === 'access_denied') return 'Google sign-in was cancelled.';
  if (code === 'not_configured') return 'Google sign-in is not configured yet.';
  return 'Google sign-in could not be completed. Please try again.';
}

function LoadingShell() {
  return (
    <main className="flex h-dvh items-center justify-center bg-[#090909] text-sm text-[#777777]">
      Preparing your private space…
    </main>
  );
}

function UnauthenticatedChat({ configured, error }: { configured: boolean; error: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex h-[100dvh] overscroll-none overflow-hidden bg-[#090909]">
      <ChatSidebar
        open={sidebarOpen}
        conversations={[]}
        activeId={null}
        user={null}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        onNew={() => undefined}
        onSelect={() => undefined}
        onDelete={() => undefined}
        onLogout={() => undefined}
      />
      <section
        className="flex min-w-0 flex-1 flex-col px-4 pt-[calc(env(safe-area-inset-top)+4rem)] sm:px-5 lg:px-5 lg:pb-6 lg:pt-6"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-1 items-center justify-center">
          <GoogleSignIn configured={configured} error={error} />
        </div>
        <div className="mx-auto w-full max-w-[780px]">
          <ChatComposer value="" disabled onChange={() => undefined} onSubmit={() => undefined} />
        </div>
      </section>
    </main>
  );
}

function AuthenticatedChat({
  user,
  onSessionExpired,
}: {
  user: SessionUser;
  onSessionExpired: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryRequest, setRetryRequest] = useState<{
    conversationId: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  } | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    startNewConversation,
    ensureConversation,
    appendMessage,
    deleteConversation,
  } = useLocalConversations(user.email);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeConversation?.messages.length, loading]);

  async function requestAssistant(
    conversationId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ) {
    setLoading(true);
    setError('');
    setRetryRequest({ conversationId, messages });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = (await response.json().catch(() => ({}))) as CompletionResponse;

      if (response.status === 401) {
        onSessionExpired();
        return;
      }
      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? 'You are sending messages too quickly. Wait a moment and retry.'
            : data.error || 'AdultGen Companion is temporarily offline.'
        );
      }

      const content = bubblesFromAssistantMessage(data).join('\n\n').trim();
      if (!content) throw new Error('AdultGen Companion returned an empty response.');

      appendMessage(conversationId, createLocalMessage('assistant', content));
      setRetryRequest(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'AdultGen Companion is temporarily offline.'
      );
    } finally {
      setLoading(false);
    }
  }

  function sendMessage(messageOverride?: string) {
    const text = (messageOverride ?? prompt).trim();
    if (!text || loading) return;

    const conversationId = ensureConversation(text);
    const userMessage = createLocalMessage('user', text);
    const requestMessages = [...(activeConversation?.messages ?? []), userMessage].map(
      (message) => ({ role: message.role, content: message.content })
    );

    appendMessage(conversationId, userMessage);
    setPrompt('');
    void requestAssistant(conversationId, requestMessages);
  }

  async function logout() {
    await fetch('/api/user-logout', { method: 'POST', credentials: 'include' });
    onSessionExpired();
  }

  function newConversation() {
    startNewConversation();
    setPrompt('');
    setError('');
    setRetryRequest(null);
  }

  const hasMessages = Boolean(activeConversation?.messages.length);
  const retry = retryRequest ? () => void requestAssistant(retryRequest.conversationId, retryRequest.messages) : undefined;

  return (
    <main className="flex h-[100dvh] overscroll-none overflow-hidden bg-[#090909] text-white">
      <ChatSidebar
        open={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        user={user}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        onNew={newConversation}
        onSelect={(id) => {
          setActiveId(id);
          setError('');
          setRetryRequest(null);
        }}
        onDelete={deleteConversation}
        onLogout={() => void logout()}
      />

      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 shrink-0 items-center justify-center border-b border-white/[0.04] px-16 pt-[env(safe-area-inset-top)] lg:h-16 lg:justify-between lg:px-6 lg:pt-0">
          <p className="max-w-full truncate rounded-full border border-white/[0.08] bg-[#1b1b1b] px-4 py-2.5 text-sm font-medium text-[#e0e0e0] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-[#d5d5d5]">
            {activeConversation?.title || 'AdultGen Companion'}
          </p>
          <div className="hidden items-center gap-2 text-xs text-[#777777] lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#777777]" /> Text chat
          </div>
          <button
            type="button"
            aria-label="Start new chat"
            onClick={newConversation}
            className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.55rem)] flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-white/[0.08] bg-[#1b1b1b] text-[#d0d0d0] hover:bg-[#242424] hover:text-white lg:hidden"
          >
            <MessageSquarePlus size={19} />
          </button>
        </header>

        {!hasMessages ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-3 pt-4 sm:items-center sm:justify-center sm:px-5 sm:pb-8">
            <div className="mt-auto w-full max-w-[780px] sm:my-auto">
              <div className="mb-9 hidden text-center sm:block">
                <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Sparkles size={18} className="text-[#b78aff]" />
                </div>
                <h1 className="text-[28px] font-medium tracking-[-0.5px] text-[#f3f3f3] md:text-[32px]">
                  What are you imagining?
                </h1>
              </div>
              <div className="mb-4 grid gap-1 px-1 sm:mb-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
                {suggestions.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPrompt(label)}
                    className="flex min-h-11 touch-manipulation items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] text-[#b8b8b8] transition-colors hover:bg-white/[0.05] hover:text-white sm:min-h-0 sm:gap-2 sm:rounded-full sm:border sm:border-white/[0.09] sm:px-3.5 sm:text-xs sm:text-[#999999] sm:hover:border-white/[0.16]"
                  >
                    <Icon size={18} className="shrink-0 text-[#a9a9a9] sm:h-3.5 sm:w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
              <ChatComposer value={prompt} loading={loading} onChange={setPrompt} onSubmit={() => sendMessage()} />
              {error && <ChatError message={error} onRetry={retry} />}
            </div>
          </div>
        ) : (
          <>
            <div ref={threadRef} className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-3 py-5 sm:px-5 sm:py-8">
              <div className="mx-auto w-full max-w-[780px] space-y-7">
                {activeConversation?.messages.map((message: LocalChatMessage) => (
                  <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                    {message.role === 'assistant' ? (
                      <div className="flex max-w-[88%] items-start gap-3 md:max-w-[82%]">
                        <img src="/brand/adultgen-logo.png" alt="" className="mt-0.5 h-8 w-8 shrink-0 object-contain" />
                        <p className="whitespace-pre-wrap pt-1 text-[15px] leading-7 text-[#e7e7e7]">{message.content}</p>
                      </div>
                    ) : (
                      <p className="max-w-[82%] whitespace-pre-wrap rounded-[20px] bg-[#2f2f2f] px-4 py-2.5 text-[15px] leading-6 text-[#f1f1f1]">{message.content}</p>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3 text-sm text-[#777777]">
                    <img src="/brand/adultgen-logo.png" alt="" className="h-8 w-8 object-contain" />
                    <span className="animate-pulse">Thinking…</span>
                  </div>
                )}
                {error && <ChatError message={error} onRetry={retry} />}
              </div>
            </div>
            <div
              className="shrink-0 bg-gradient-to-t from-[#090909] via-[#090909] to-transparent px-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4"
              style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
            >
              <div className="mx-auto w-full max-w-[780px]">
                <ChatComposer value={prompt} loading={loading} onChange={setPrompt} onSubmit={() => sendMessage()} />
                <p className="mt-2 hidden text-center text-[11px] text-[#555555] sm:block">Fictional consenting adults only. AI responses may be inaccurate.</p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function ChatError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mt-5 flex items-start justify-between gap-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      <span className="flex items-start gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0" />{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="flex shrink-0 items-center gap-1 font-semibold text-white">
          <RotateCcw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

export default function Chat() {
  usePageMeta({
    title: 'Private Chat | AdultGen AI',
    description:
      'Private AI companion chat for verified adults, with fictional-adult safety controls and browser-local conversation history.',
    canonical: 'https://adultgen.fun/chat',
  });

  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const authError = authErrorMessage(new URLSearchParams(window.location.search).get('auth_error'));

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch('/api/user-session', { credentials: 'include' });
        const data = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
          user?: SessionUser | null;
        };
        if (!active) return;
        setConfigured(Boolean(data.configured));
        setUser(data.authenticated && data.user ? data.user : null);
      } catch {
        if (active) {
          setConfigured(false);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadSession();
    return () => { active = false; };
  }, []);

  if (loading) return <LoadingShell />;
  if (!user) return <UnauthenticatedChat configured={configured} error={authError} />;
  return <AuthenticatedChat key={user.email} user={user} onSessionExpired={() => setUser(null)} />;
}
