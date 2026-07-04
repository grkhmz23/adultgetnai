import { useInView } from '../hooks/useInView';

const features = [
  {
    title: 'Sexting Chat',
    description:
      'Live private beta: immersive sex chat, erotic roleplay, and an AdultGen companion model built exclusively for verified adults.',
    image: '/images/image-studio.jpg',
    tag: 'Live now',
    color: '#8338ec',
    href: '/contact',
  },
  {
    title: 'Safety & Compliance',
    description:
      'Fictional adults only, hard blocks on minors and real-person misuse, age gate, audit-friendly prompts, and transparent AI labeling on future media.',
    image: '/images/gallery-2.jpg',
    tag: 'Day one',
    color: '#ff006e',
    href: '/content-policy',
  },
  {
    title: 'Synthetic Images',
    description:
      'Purpose-built still-image pipeline for fictional adults — consent controls, prompt safety, and no real-person likeness. In active development.',
    image: '/images/character-creator.jpg',
    tag: 'In development',
    color: '#3a86ff',
    href: '/contact',
  },
  {
    title: 'Synthetic Video',
    description:
      'Short-form private adult video from structured scene intent. Built after chat and image prove retention, safety, and unit economics.',
    image: '/images/video-studio.jpg',
    tag: 'Roadmap',
    color: '#8338ec',
    href: '/contact',
  },
];

export default function FeatureShowcase() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-[#050505] py-[120px] md:py-[160px]"
      style={{ zIndex: 2 }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-20 text-center">
          <h2
            className={`reveal-up text-[40px] font-semibold leading-tight tracking-[-2px] text-white md:text-[64px] ${inView ? 'is-visible' : ''}`}
          >
            Chat-first.{' '}
            <span className="gradient-text">Media next.</span>
          </h2>
          <p
            className={`reveal-up reveal-up-delay-1 mx-auto mt-4 max-w-[520px] text-base leading-relaxed text-[#b0b0b0] ${inView ? 'is-visible' : ''}`}
          >
            Uncensored adult chat ships today. Synthetic image and video layers are the next
            product phase — built with the same compliance and fictional-adult-only standard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {features.map((feature, index) => {
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
                className={`reveal-up ${delayClass} group block overflow-hidden rounded-3xl border border-white/[0.14] bg-[#111113] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 ${inView ? 'is-visible' : ''}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.tag}
                  </div>

                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-[#b0b0b0]">{feature.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
