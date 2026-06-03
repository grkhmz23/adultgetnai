import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clapperboard, MessageCircle, ShieldCheck, UserRound, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MessageCircle,
    title: 'Private Companion',
    description:
      'A private conversational layer for capturing user intent, tone, preference, and fantasy direction in an adult-only verified environment.',
    image: '/images/image-studio.jpg',
    tag: 'Private Demo',
    color: '#8338ec',
  },
  {
    icon: UserRound,
    title: 'Verified Digital Twin',
    description:
      'Roadmap feature for verified users to create a consent-bound self avatar, then use that digital twin in future private synthetic adult video workflows.',
    image: '/images/character-creator.jpg',
    tag: 'HeyGen-Style Roadmap',
    color: '#3a86ff',
  },
  {
    icon: ShieldCheck,
    title: 'Scene Director',
    description:
      'Transforms natural language into structured fictional adult scene concepts, including setting, archetypes, mood, camera direction, and safety status.',
    image: '/images/gallery-2.jpg',
    tag: 'Prompt Engine',
    color: '#ff006e',
  },
  {
    icon: Clapperboard,
    title: 'Video Pipeline',
    description:
      'Planned short-form synthetic adult video layer built around fictional adults, self-avatar consent controls, AI labeling, and prompt/output safety.',
    image: '/images/video-studio.jpg',
    tag: 'Planned Generation',
    color: '#121212',
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
            Built For Private{' '}
            <span className="gradient-text">Synthetic Video.</span>
          </h2>
          <p className="text-[#888888] text-base mt-4 max-w-[500px] mx-auto">
            AdultGen is being developed as a compliance-first creation layer for verified adults, starting with private intent capture and structured scene generation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="glass-card overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
