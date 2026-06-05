import { Clapperboard, Image, MessageCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: MessageCircle,
    title: 'Sexting Chat',
    description:
      'Live private beta: 38 fictional adult personas, immersive private chat, and AdultGen companion models for verified adults.',
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
  const { ref: sectionRef, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-[#fbfbfb] py-[120px] md:py-[160px]"
      style={{ zIndex: 2 }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-20 text-center">
          <h2
            className={`reveal-up text-[40px] font-semibold leading-tight tracking-[-2px] text-[#121212] md:text-[64px] ${inView ? 'is-visible' : ''}`}
          >
            Chat-first.{' '}
            <span className="gradient-text">Media next.</span>
          </h2>
          <p
            className={`reveal-up reveal-up-delay-1 mx-auto mt-4 max-w-[520px] text-base text-[#888888] ${inView ? 'is-visible' : ''}`}
          >
            Uncensored adult chat ships today. Synthetic image and video layers are the next
            fundraise — built with the same compliance and fictional-adult-only standard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const delayClass =
              index === 1
                ? 'reveal-up-delay-1'
                : index === 2
                  ? 'reveal-up-delay-2'
                  : index >= 3
                    ? 'reveal-up-delay-2'
                    : '';
            return (
              <a
                key={feature.title}
                href={feature.href}
                className={`reveal-up ${delayClass} glass-card group block overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] ${inView ? 'is-visible' : ''}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.tag}
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={16} className="text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon size={18} style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#121212]">{feature.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#888888]">{feature.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}