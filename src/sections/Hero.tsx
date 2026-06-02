import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { requestEarlyAccess } from '../lib/requestEarlyAccess';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLParagraphElement>(null);

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
          inputRef.current,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          microRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-black/8 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={14} className="text-[#8338ec]" />
          <span className="text-xs font-medium text-[#888888] tracking-wide">
            AI-POWERED. PERSONALIZED. PRIVATE.
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-[48px] md:text-[72px] font-semibold leading-[1.05] tracking-[-2px] text-[#121212] mb-6"
          style={{ opacity: 0 }}
        >
          Intelligent Generation.
          <br />
          <span className="gradient-text">Cinematic Results.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-[#888888] max-w-[600px] mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0 }}
        >
          The most advanced AI engine for creating photorealistic characters,
          images, and videos. Private, secure, and lightning-fast.
        </p>

        {/* Input Group */}
        <div
          ref={inputRef}
          className="glass-input max-w-[500px] mx-auto flex items-center p-1.5 pl-5 mb-4"
          style={{ opacity: 0 }}
        >
          <input
            type="text"
            placeholder="Describe your scene..."
            className="flex-1 bg-transparent text-sm text-[#121212] placeholder:text-[#aaaaaa] outline-none pr-3"
          />
          <button
            type="button"
            onClick={requestEarlyAccess}
            className="bg-[#121212] text-white text-sm font-medium px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shrink-0"
          >
            Generate
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Micro Copy */}
        <p
          ref={microRef}
          className="text-xs text-[#aaaaaa] font-medium"
          style={{ opacity: 0 }}
        >
          No credit card required. Instant generation.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[3px] text-[#aaaaaa]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#aaaaaa] to-transparent" />
      </div>
    </section>
  );
}
