import { useState } from 'react';
import type { FormEvent } from 'react';
import BrandLogo from '../components/BrandLogo';
import { adultgenConfig } from '../lib/runtimeConfig';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type CompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const accessStorageKey = 'adultgen-investor-access-key';

export default function InvestorDemo() {
  const [accessKey, setAccessKey] = useState(
    () => localStorage.getItem(accessStorageKey) || ''
  );
  const [draftAccessKey, setDraftAccessKey] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [backendUrl, setBackendUrl] = useState(adultgenConfig.backendUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const hasAccess = Boolean(accessKey);

  function submitAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAccessKey = draftAccessKey.trim();
    setAccessKey(nextAccessKey);
    localStorage.setItem(accessStorageKey, nextAccessKey);
    setError('');
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
      const response = await fetch(`${backendUrl.replace(/\/$/, '')}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessKey}`,
          'X-AdultGen-Access-Key': accessKey,
        },
        body: JSON.stringify({
          model: adultgenConfig.model,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = (await response.json()) as CompletionResponse;
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Backend returned an empty response');
      }

      setMessages([...nextMessages, { role: 'assistant', content }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend request failed');
      setMessages(nextMessages);
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-6">
        <form
          onSubmit={submitAccess}
          className="glass-card w-full max-w-[420px] p-8"
        >
          <BrandLogo className="mb-8" />
          <label className="block text-sm font-medium text-[#121212] mb-2">
            Private access key
          </label>
          <input
            type="password"
            value={draftAccessKey}
            onChange={(event) => setDraftAccessKey(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#121212] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01]"
          >
            Continue
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
            onClick={() => {
              localStorage.removeItem(accessStorageKey);
              setAccessKey('');
              setMessages([]);
            }}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#121212]"
          >
            Lock
          </button>
        </header>

        <section className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-black/5 p-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#888888]">
              Backend URL
            </label>
            <input
              type="url"
              value={backendUrl}
              onChange={(event) => setBackendUrl(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
            />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[78%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#121212] text-white'
                      : 'bg-white text-[#121212] shadow-[0_1px_12px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <p className="text-sm text-[#888888]">Generating...</p>
            )}
            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={submitPrompt} className="border-t border-black/5 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[#121212] outline-none focus:border-[#8338ec]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="shrink-0 rounded-full bg-[#121212] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
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
