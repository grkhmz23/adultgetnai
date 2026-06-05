import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clapperboard, Image, MessageCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MessageCircle,
    title: 'Sexting Chat',
    description:
      'Live private beta: 38 fictional adult personas, uncensored WhatsApp-style bubbles, and fine-tuned MLX models for verified adults.',
    image: '/images/image-studio.jpg',
    tag: 'Live now',
    color: '#8338ec',
    href: '/chat',
  },
  {
    icon: ShieldCheck,
    title: 'Safety & Compliance',
    description:
      'Fictional adults only, hard blocks on minors and real-person misuse, age gate, audit-friendly prompts, and transparent AI labeling on future media.',
    image: '/images/gallery-2.jpg',
    tag: 'Day one',
    color: '#ff006e',
    href: '/content-policy',
  },
  {
    icon: Image,
    title: 'Synthetic Images',
    description:
      'Investor-backed still-image pipeline for fictional adults — consent controls, prompt safety, and no real-person likeness. In active development.',
    image: '/images/character-creator.jpg',
    tag: 'Seeking investment',
    color: '#3a86ff',
    href: '/contact',
  },
  {
    icon: Clapperboard,
    title: 'Synthetic Video',
    description:
      'Short-form private adult video from structured scene intent. Built after chat and image prove retention, safety, and unit economics.',
    image: '/images/video-studio.jpg',
    tag: 'Roadmap',
    color: '#121212',
    href: '/contact',
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards stagger animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-[#fbfbfb] py-[120px] md:py-[160px]"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            ref={headingRef}
            className="text-[40px] md:text-[64px] font-semibold tracking-[-2px] text-[#121212] leading-tight"
            style={{ opacity: 0 }}
          >
            Chat-first.{' '}
            <span className="gradient-text">Media next.</span>
          </h2>
          <p className="text-[#888888] text-base mt-4 max-w-[520px] mx-auto">
            Uncensored adult chat ships today. Synthetic image and video layers are the next fundraise — built with the same compliance and fictional-adult-only standard.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.title}
                href={feature.href}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="glass-card overflow-hidden group block transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
                style={{ opacity: 0 }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Tag */}
                  <div
                    className="absolute top-4 left-4 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.tag}
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight size={16} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon size={18} style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#121212]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
