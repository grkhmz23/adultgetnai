import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Image, MessageCircle, Video } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { bubblesFromAssistantMessage } from '../lib/chatBubbles';

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

const modes = [
  { id: 'chat', label: 'Talk with agent', icon: MessageCircle },
  { id: 'image', label: 'Generate image', icon: Image },
  { id: 'video', label: 'Generate video', icon: Video },
] as const;

export default function InvestorDemo() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('chat');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactName, setContactName] = useState('AdultGen');
  const scrollRef = useRef<HTMLDivElement>(null);

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
          max_tokens: 1024,
          temperature: 0.85,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = (await response.json()) as CompletionResponse;
      const bubbleList = bubblesFromAssistantMessage(data);
      const content = bubbleList.join('\n\n');

      if (!content) {
        throw new Error('Backend returned an empty response');
      }

      if (data.adultgen?.persona_name) {
        setContactName(data.adultgen.persona_name.replace(/\s*\([^)]*\)\s*$/, '').trim());
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
      <main className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-6">
        <p className="text-sm text-[#888888]">Checking access...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-6">
        <form
          onSubmit={submitLogin}
          className="glass-card w-full max-w-[420px] p-8"
        >
          <BrandLogo className="mb-8" />
          <label className="block text-sm font-medium text-[#121212] mb-2">
            Login
          </label>
          <input
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
            autoComplete="username"
          />
          <label className="block text-sm font-medium text-[#121212] mt-4 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
            autoComplete="current-password"
          />
          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-full bg-[#121212] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbfb] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[960px] flex-col">
        <header className="mb-6 flex items-center justify-between gap-4">
          <BrandLogo compact />
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/investor-logout', {
                method: 'POST',
                credentials: 'include',
              });
              setAuthenticated(false);
              setMessages([]);
              setContactName('AdultGen');
            }}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#121212]"
          >
            Lock
          </button>
        </header>

        <section className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden bg-[#e5ddd5]">
          <div className="border-b border-black/5 bg-[#f0f0f0] px-4 py-3">
            <p className="text-sm font-semibold text-[#121212]">{contactName}</p>
            <p className="text-xs text-[#667781]">online</p>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
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
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={submitPrompt} className="border-t border-black/5 bg-[#f0f0f0] p-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <div className="flex w-full shrink-0 items-center gap-1 sm:w-auto">
                {modes.map((item) => {
                  const Icon = item.icon;
                  const selected = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={item.label}
                      title={item.label}
                      onClick={() => setMode(item.id)}
                      className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selected
                          ? 'bg-[#121212] text-white'
                          : 'text-[#888888] hover:bg-black/5 hover:text-[#121212]'
                      }`}
                    >
                      <Icon size={17} />
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={
                  mode === 'chat'
                    ? 'Send your message...'
                    : mode === 'image'
                      ? 'Describe the image prompt...'
                      : 'Describe the video scene prompt...'
                }
                className="min-w-[160px] flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full shrink-0 rounded-full bg-[#121212] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
