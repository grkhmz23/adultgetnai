import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Lock, MessageCircle, Search, Sparkles, Video } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { bubblesFromAssistantMessage } from '../lib/chatBubbles';
import { CHAT_PERSONAS, getChatPersonaLabel, type ChatPersonaId } from '../data/personas';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  bubbles?: string[];
};

type CompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
      bubbles?: string[];
    };
  }>;
  adultgen?: {
    persona_id?: string | null;
    persona_name?: string | null;
  };
};

const STARTER_PROMPTS = [
  'Hey… I missed you.',
  'Be Marcus, my strict stepdad.',
  'Roleplay as my teasing stepsister.',
  'I need you to take control tonight.',
];

function stripPersonaSuffix(name: string) {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

export default function InvestorDemo() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [personaId, setPersonaId] = useState<ChatPersonaId | ''>('');
  const [personaQuery, setPersonaQuery] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactName, setContactName] = useState('AdultGen Companion');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredPersonas = useMemo(() => {
    const query = personaQuery.trim().toLowerCase();
    if (!query) return CHAT_PERSONAS;
    return CHAT_PERSONAS.filter((persona) => persona.label.toLowerCase().includes(query));
  }, [personaQuery]);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const response = await fetch('/api/investor-session', {
          credentials: 'include',
        });
        const data = (await response.json()) as { authenticated?: boolean };
        if (mounted) setAuthenticated(Boolean(data.authenticated));
      } catch {
        if (mounted) setAuthenticated(false);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!personaId) return;
    setContactName(stripPersonaSuffix(getChatPersonaLabel(personaId)));
  }, [personaId]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/investor-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        throw new Error(response.status === 500 ? 'Auth is not configured' : 'Invalid credentials');
      }

      setAuthenticated(true);
      setLogin('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  function handlePersonaChange(nextId: ChatPersonaId | '') {
    if (nextId === personaId) return;

    if (messages.length > 0) {
      const confirmed = window.confirm(
        'Switching persona clears this conversation. Continue?'
      );
      if (!confirmed) return;
    }

    setPersonaId(nextId);
    setMessages([]);
    setError('');
    setContactName(nextId ? stripPersonaSuffix(getChatPersonaLabel(nextId)) : 'AdultGen Companion');
  }

  async function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextPrompt = prompt.trim();
    if (!nextPrompt || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: nextPrompt },
    ];

    setMessages(nextMessages);
    setPrompt('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/investor-chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          persona_id: personaId || undefined,
          max_tokens: 1024,
          temperature: 0.85,
        }),
      });

      if (!response.ok) {
        const hint =
          response.status === 502 || response.status === 500
            ? 'Chat backend may be offline. Ensure MLX is running and the tunnel URL is set on Vercel.'
            : `Backend returned ${response.status}`;
        throw new Error(hint);
      }

      const data = (await response.json()) as CompletionResponse;
      const bubbleList = bubblesFromAssistantMessage(data);
      const content = bubbleList.join('\n\n');

      if (!content) {
        throw new Error('Backend returned an empty response');
      }

      if (data.adultgen?.persona_name) {
        setContactName(stripPersonaSuffix(data.adultgen.persona_name));
      } else if (data.adultgen?.persona_id) {
        setContactName(stripPersonaSuffix(getChatPersonaLabel(data.adultgen.persona_id)));
      }

      setMessages([
        ...nextMessages,
        { role: 'assistant', content, bubbles: bubbleList.length > 1 ? bubbleList : undefined },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend request failed');
      setMessages(nextMessages);
    } finally {
      setIsLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfbfb] px-6">
        <a
          href="/"
          className="absolute left-6 top-6 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[#121212] transition-colors hover:bg-white"
        >
          Home
        </a>
        <p className="text-sm text-[#888888]">Checking access…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#fbfbfb] px-6 py-10 md:py-14">
        <a
          href="/"
          className="mb-8 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[#121212] transition-colors hover:bg-white"
        >
          Home
        </a>

        <div className="mx-auto grid max-w-[1040px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <a href="/" aria-label="AdultGen AI home">
              <BrandLogo className="mb-6" />
            </a>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8338ec]">
              Private beta
            </p>
            <h1 className="text-[36px] font-semibold leading-tight tracking-[-1.5px] text-[#121212] md:text-[44px]">
              Uncensored adult chat,
              <span className="gradient-text"> ready now.</span>
            </h1>
            <p className="mt-4 max-w-[480px] text-base leading-relaxed text-[#888888]">
              Verified adults only. Pick from 38 fictional personas or describe who you want. Synthetic
              image and video generation are on the roadmap — we are actively seeking investors for
              that layer.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#666666]">
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#8338ec]" />
                Live WhatsApp-style sexting with MLX + fine-tuned Qwen
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-[#3a86ff]" />
                Image generation — in development
              </li>
              <li className="flex items-start gap-2">
                <Video size={16} className="mt-0.5 shrink-0 text-[#121212]" />
                Video generation — investor roadmap
              </li>
            </ul>
          </div>

          <form onSubmit={submitLogin} className="glass-card w-full p-8">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-[#121212]">
              <Lock size={16} />
              Sign in with beta credentials
            </div>
            <label className="mb-2 block text-sm font-medium text-[#121212]">Login</label>
            <input
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
              autoComplete="username"
              required
            />
            <label className="mb-2 mt-4 block text-sm font-medium text-[#121212]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-full bg-[#121212] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Checking…' : 'Enter private chat'}
            </button>
            <p className="mt-4 text-center text-xs text-[#aaaaaa]">
              18+ verified adults · fictional characters only · no public generation
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1200px] flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <a href="/" aria-label="AdultGen AI home">
            <BrandLogo compact />
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden rounded-full border border-[#2f8a4c]/20 bg-[#2f8a4c]/10 px-3 py-1.5 text-xs font-semibold text-[#2f8a4c] sm:inline-flex">
              Chat live
            </span>
            <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#888888]">
              Image & video — seeking investors
            </span>
            <a
              href="/"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#121212] transition-colors hover:bg-[#fafafa]"
            >
              Home
            </a>
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/investor-logout', {
                  method: 'POST',
                  credentials: 'include',
                });
                setAuthenticated(false);
                setMessages([]);
                setPersonaId('');
                setContactName('AdultGen Companion');
              }}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#121212]"
            >
              Lock
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <aside className="glass-card flex w-full shrink-0 flex-col overflow-hidden lg:w-[300px]">
            <div className="border-b border-black/5 px-4 py-3">
              <p className="text-sm font-semibold text-[#121212]">Personas</p>
              <p className="text-xs text-[#888888]">38 fictional adults · 18+ only</p>
            </div>
            <div className="border-b border-black/5 px-3 py-2">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]"
                />
                <input
                  type="search"
                  value={personaQuery}
                  onChange={(event) => setPersonaQuery(event.target.value)}
                  placeholder="Search personas…"
                  className="w-full rounded-xl border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
                />
              </div>
            </div>
            <div className="max-h-[220px] overflow-y-auto border-b border-black/5 lg:max-h-none lg:flex-1">
              <button
                type="button"
                onClick={() => handlePersonaChange('')}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  !personaId
                    ? 'bg-[#8338ec]/10 font-semibold text-[#8338ec]'
                    : 'text-[#666666] hover:bg-black/[0.03]'
                }`}
              >
                Auto-detect from chat
              </button>
              {filteredPersonas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handlePersonaChange(persona.id)}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    personaId === persona.id
                      ? 'bg-[#8338ec]/10 font-semibold text-[#8338ec]'
                      : 'text-[#444444] hover:bg-black/[0.03]'
                  }`}
                >
                  {persona.label}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[min(72vh,720px)] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-[#e5ddd5] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 border-b border-black/5 bg-[#f0f0f0] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8338ec] to-[#3a86ff] text-sm font-semibold text-white">
                {contactName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#121212]">{contactName}</p>
                <p className="text-xs text-[#667781]">
                  {personaId ? 'Selected persona' : 'Persona auto-detect'} · fictional adult
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="mx-auto max-w-[420px] rounded-2xl bg-white/90 px-5 py-6 text-center shadow-sm">
                  <p className="text-sm font-medium text-[#121212]">Start a private conversation</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#888888]">
                    Choose a persona on the left or type naturally — the model will match your tone.
                    All characters are fictional adults 18+.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {STARTER_PROMPTS.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => setPrompt(starter)}
                        className="rounded-full border border-black/10 bg-[#fbfbfb] px-3 py-1.5 text-xs text-[#555555] transition-colors hover:border-[#8338ec]/30 hover:text-[#121212]"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => {
                const parts =
                  message.role === 'assistant' && message.bubbles?.length
                    ? message.bubbles
                    : [message.content];

                return parts.map((part, partIndex) => (
                  <div
                    key={`${message.role}-${index}-${partIndex}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <p
                      className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[15px] leading-snug shadow-sm ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-[#dcf8c6] text-[#111b21]'
                          : 'rounded-bl-md bg-white text-[#111b21]'
                      }`}
                    >
                      {part}
                    </p>
                  </div>
                ));
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <p className="rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm text-[#667781] shadow-sm">
                    typing…
                  </p>
                </div>
              )}

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
            </div>

            <form onSubmit={submitPrompt} className="border-t border-black/5 bg-[#f0f0f0] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] px-3 py-1 text-[11px] font-semibold text-white">
                  <MessageCircle size={12} />
                  Chat
                </span>
                <span
                  title="Synthetic image generation is in development — contact us for investor materials."
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#aaaaaa]"
                >
                  <Sparkles size={12} />
                  Image — soon
                </span>
                <span
                  title="Synthetic video is on the investor roadmap."
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#aaaaaa]"
                >
                  <Video size={12} />
                  Video — roadmap
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Message…"
                  className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shrink-0 rounded-full bg-[#121212] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}