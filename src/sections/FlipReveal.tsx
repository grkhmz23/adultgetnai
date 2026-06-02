import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEXT1 = 'UNLEASH';
const TEXT2 = 'CREATION';

export default function FlipReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLDivElement[];

    // Create the scroll-driven flip animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          pin: true,
        },
      });

      letters.forEach((letterContainer, i) => {
        const div1 = letterContainer.querySelector('.flip-front') as HTMLElement;
        const div2 = letterContainer.querySelector('.flip-back') as HTMLElement;

        if (!div1 || !div2) return;

        const l = TEXT1.length;
        const st = 0.8 * (i / l);
        const d = 0.8 / l;

        tl.fromTo(
          div1,
          { rotateX: 0, opacity: 1 },
          {
            rotateX: 90,
            opacity: 0,
            duration: d,
            ease: 'power2.inOut',
          },
          st
        );

        tl.fromTo(
          div2,
          { rotateX: -90, opacity: 0 },
          {
            rotateX: 0,
            opacity: 1,
            duration: d,
            ease: 'power2.inOut',
          },
          st
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pad strings to same length
  const maxLen = Math.max(TEXT1.length, TEXT2.length);
  const padded1 = TEXT1.padEnd(maxLen, ' ');
  const padded2 = TEXT2.padEnd(maxLen, ' ');

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#fbfbfb]"
      style={{ height: '200vh', zIndex: 2 }}
    >
      <div
        ref={containerRef}
        className="h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background gradient orb */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #8338ec 0%, #3a86ff 50%, transparent 70%)',
          }}
        />

        {/* Flipping Letters */}
        <div className="relative flex items-center justify-center" style={{ perspective: 1000 }}>
          {padded1.split('').map((char, i) => (
            <div
              key={i}
              ref={(el) => { lettersRef.current[i] = el; }}
              className="relative inline-block overflow-hidden"
              style={{
                width: char === ' ' ? '0.3em' : '0.7em',
                height: '1.2em',
                perspective: 1000,
              }}
            >
              {/* Front letter */}
              <div
                className="flip-front absolute inset-0 flex items-center justify-center text-[#121212] font-semibold"
                style={{
                  fontSize: 'clamp(48px, 12vw, 120px)',
                  letterSpacing: '-2px',
                  backfaceVisibility: 'hidden',
                  transformOrigin: 'center center -0.4em',
                }}
              >
                {char}
              </div>

              {/* Back letter */}
              <div
                className="flip-back absolute inset-0 flex items-center justify-center font-semibold"
                style={{
                  fontSize: 'clamp(48px, 12vw, 120px)',
                  letterSpacing: '-2px',
                  color: '#8338ec',
                  backfaceVisibility: 'hidden',
                  transformOrigin: 'center center -0.4em',
                  transform: 'rotateX(-90deg)',
                  opacity: 0,
                }}
              >
                {padded2[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-[#888888] text-sm mt-8 text-center max-w-[400px]">
          Scroll to transform imagination into reality
        </p>
      </div>
    </section>
  );
}
