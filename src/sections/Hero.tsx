import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { requestEarlyAccess } from '../lib/requestEarlyAccess';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

        {/* Access actions */}
        <div
          ref={ctaRef}
          className="mx-auto flex max-w-[520px] flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={requestEarlyAccess}
            className="w-full rounded-full bg-[#121212] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:w-auto"
          >
            Request Early Access
          </button>
          <a
            href="/investor-demo"
            className="w-full rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[#121212] transition-all duration-300 hover:scale-[1.02] hover:bg-white sm:w-auto"
          >
            Beta Access
          </a>
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
