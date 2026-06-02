import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Image, MessageCircle, Video } from 'lucide-react';
import { requestEarlyAccess } from '../lib/requestEarlyAccess';

const modes = [
  { id: 'chat', label: 'Talk with agent', icon: MessageCircle },
  { id: 'image', label: 'Generate image', icon: Image },
  { id: 'video', label: 'Generate video', icon: Video },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('chat');
  const [prompt, setPrompt] = useState('');
  const [accessNotice, setAccessNotice] = useState(false);

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
        {/* Eyebrow */}
        <div className="inline-flex items-center bg-white/60 backdrop-blur-md border border-black/8 rounded-full px-4 py-1.5 mb-8">
          <span className="text-xs font-medium text-[#888888] tracking-wide">
            The video-first AI layer for adult entertainment
          </span>
        </div>

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

        {/* Input Group */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setAccessNotice(true);
          }}
          ref={inputRef}
          className="glass-input max-w-[620px] mx-auto flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 pl-3 mb-4"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1 shrink-0">
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
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    selected
                      ? 'bg-[#121212] text-white'
                      : 'text-[#888888] hover:bg-black/5 hover:text-[#121212]'
                  }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setAccessNotice(false);
            }}
            placeholder="Describe your scene..."
            className="min-w-[140px] flex-1 bg-transparent text-sm text-[#121212] placeholder:text-[#aaaaaa] outline-none px-2"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#121212] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shrink-0"
          >
            Send your message
          </button>
        </form>

        {accessNotice && (
          <div className="mx-auto mt-3 flex max-w-[620px] flex-col items-center gap-2 rounded-2xl border border-[#8338ec]/15 bg-white/70 px-4 py-3 text-center backdrop-blur-md sm:flex-row sm:justify-center">
            <p className="text-sm font-medium text-[#888888]">
              Access required to chat or generate.
            </p>
            <button
              type="button"
              onClick={requestEarlyAccess}
              className="text-sm font-semibold text-[#8338ec] hover:text-[#121212] transition-colors"
            >
              Request private demo
            </button>
          </div>
        )}

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[3px] text-[#aaaaaa]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#aaaaaa] to-transparent" />
      </div>
    </section>
  );
}
