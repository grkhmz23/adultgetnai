import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { requestEarlyAccess } from '../lib/requestEarlyAccess';
import { adultgenConfig } from '../lib/runtimeConfig';
import { useInView } from '../hooks/useInView';

type FormStatus = 'idle' | 'submitting' | 'sent' | 'error';

export default function Hero() {
  const { ref: sectionRef, inView } = useInView<HTMLDivElement>();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    function openEarlyAccess() {
      setError('');
      if (status !== 'sent') setStatus('idle');
      setEarlyAccessOpen(true);
      window.setTimeout(() => firstFieldRef.current?.focus(), 100);
    }

    window.addEventListener('adultgen:open-early-access', openEarlyAccess);
    return () => window.removeEventListener('adultgen:open-early-access', openEarlyAccess);
  }, [status]);

  useEffect(() => {
    if (!earlyAccessOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setEarlyAccessOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [earlyAccessOpen]);

  async function handleEarlyAccessSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      companyWebsite: String(formData.get('company_website') || '').trim(),
    };

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data?.mailtoHref) {
          window.location.href = data.mailtoHref;
          setStatus('idle');
          return;
        }

        throw new Error(data?.error || 'Request could not be sent');
      }

      form.reset();
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Request could not be sent');
    }
  }

  const visibleClass = inView ? 'is-visible' : '';

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-20"
      style={{ zIndex: 1 }}
    >
      <div className="mx-auto max-w-[800px] text-center">
        <h1
          className={`reveal-up mb-6 text-[48px] font-semibold leading-[1.05] tracking-[-2px] text-white md:text-[72px] ${visibleClass}`}
        >
          Private uncensored sexting
          <br />
          <span className="gradient-text">for verified adults.</span>
        </h1>

        <p
          className={`reveal-up reveal-up-delay-1 mx-auto mb-10 max-w-[600px] text-base leading-relaxed text-[#888888] md:text-lg ${visibleClass}`}
        >
          AdultGen chat is live in private beta — 38 fictional personas, natural
          private messaging, and in-house companion models built for adult roleplay.
          Synthetic image and video generation are our next milestone, built around
          fictional adults, consent controls, and private-by-design experiences.
        </p>

        <div
          className={`reveal-up reveal-up-delay-2 mx-auto flex max-w-[520px] flex-col items-center justify-center gap-3 sm:flex-row ${visibleClass}`}
        >
          <button
            type="button"
            onClick={requestEarlyAccess}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:w-auto"
          >
            Request Early Access
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[3px] text-[#aaaaaa]">Scroll</span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-[#aaaaaa] to-transparent" />
      </div>

      {earlyAccessOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEarlyAccessOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="early-access-title"
            className="glass-card relative w-full max-w-[560px] p-5 text-left shadow-2xl md:p-6"
          >
            <button
              type="button"
              aria-label="Close early access form"
              onClick={() => setEarlyAccessOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#888888] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="pr-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#8338ec]">
                Private access
              </p>
              <h2 id="early-access-title" className="text-2xl font-semibold text-white">
                Request Early Access
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#888888]">
                Tell us who you are and what kind of access you need. Requests go
                directly to AdultGen AI for private review.
              </p>
            </div>

            {status === 'sent' ? (
              <div className="mt-6 rounded-2xl border border-[#2f8a4c]/15 bg-[#2f8a4c]/10 px-4 py-4">
                <p className="text-sm font-semibold text-[#2f8a4c]">
                  Request sent. We will review it privately.
                </p>
                <button
                  type="button"
                  onClick={() => setEarlyAccessOpen(false)}
                  className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111111]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleEarlyAccessSubmit} className="mt-6 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="sr-only" htmlFor="early-access-name">
                    Name
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="early-access-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Name"
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#777777] focus:border-[#8338ec]/60"
                  />
                  <label className="sr-only" htmlFor="early-access-email">
                    Email
                  </label>
                  <input
                    id="early-access-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email"
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#777777] focus:border-[#8338ec]/60"
                  />
                </div>
                <label className="sr-only" htmlFor="early-access-message">
                  Message
                </label>
                <textarea
                  id="early-access-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us who you are and why you want access."
                  className="min-h-28 resize-none rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#777777] focus:border-[#8338ec]/60"
                />
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                {status === 'error' && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-[#b42318]">
                    {error}{' '}
                    <a href={adultgenConfig.earlyAccessUrl} className="underline">
                      Email us instead.
                    </a>
                  </p>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEarlyAccessOpen(false)}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
