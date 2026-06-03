import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { adultgenConfig } from '../lib/runtimeConfig';

type FormStatus = 'idle' | 'submitting' | 'sent' | 'error';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
        .fromTo(
          subtitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-20"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-[800px] mx-auto text-center">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-[48px] md:text-[72px] font-semibold leading-[1.05] tracking-[-2px] text-[#121212] mb-6"
          style={{ opacity: 0 }}
        >
          From endless adult search
          <br />
          <span className="gradient-text">to private synthetic creation.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-[#888888] max-w-[600px] mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0 }}
        >
          AdultGen transforms private user intent into structured, personalized
          adult video experiences for verified adults. Built with compliance,
          safety, consent controls, and AI transparency from day one.
        </p>

        {/* Access form */}
        <div
          id="early-access"
          ref={ctaRef}
          className="glass-card mx-auto max-w-[620px] p-3 text-left"
          style={{ opacity: 0 }}
        >
          <form
            onSubmit={handleEarlyAccessSubmit}
            className="grid gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="sr-only" htmlFor="early-access-name">
                Name
              </label>
              <input
                id="early-access-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Name"
                className="min-h-12 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-[#121212] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#8338ec]/45"
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
                className="min-h-12 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-[#121212] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#8338ec]/45"
              />
            </div>
            <label className="sr-only" htmlFor="early-access-message">
              Message
            </label>
            <textarea
              id="early-access-message"
              name="message"
              required
              rows={3}
              placeholder="Tell us who you are and why you want access."
              className="min-h-24 resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-[#121212] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#8338ec]/45"
            />
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-5 text-center text-sm sm:text-left">
                {status === 'sent' && (
                  <span className="font-medium text-[#2f8a4c]">
                    Request sent. We will review it privately.
                  </span>
                )}
                {status === 'error' && (
                  <span className="font-medium text-[#b42318]">
                    {error}{' '}
                    <a href={adultgenConfig.earlyAccessUrl} className="underline">
                      Email us instead.
                    </a>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="rounded-full bg-[#121212] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending...' : 'Request Early Access'}
                </button>
                <a
                  href="/investor-demo"
                  className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-center text-sm font-semibold text-[#121212] transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                >
                  Beta Access
                </a>
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[3px] text-[#aaaaaa]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#aaaaaa] to-transparent" />
      </div>
    </section>
  );
}
