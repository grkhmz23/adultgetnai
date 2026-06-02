import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wand2, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const models = [
  {
    name: 'Aria',
    style: 'Realistic',
    image: '/images/gallery-1.jpg',
  },
  {
    name: 'Neon',
    style: 'Cyberpunk',
    image: '/images/gallery-3.jpg',
  },
  {
    name: 'Luna',
    style: 'Fantasy',
    image: '/images/gallery-5.jpg',
  },
  {
    name: 'Nova',
    style: 'Sci-Fi',
    image: '/images/gallery-7.jpg',
  },
];

const stats = [
  { icon: Wand2, value: '50M+', label: 'Generations' },
  { icon: Shield, value: '100%', label: 'Private' },
  { icon: Zap, value: '<2s', label: 'Avg. Speed' },
];

export default function ModelsGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.model-card');
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="models"
      className="relative bg-[#fbfbfb] py-[120px] md:py-[160px]"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <h2 className="text-[40px] md:text-[64px] font-semibold tracking-[-2px] text-[#121212] leading-tight">
            Meet Your <span className="gradient-text">Models.</span>
          </h2>
          <p className="text-[#888888] text-base mt-4 max-w-[520px] mx-auto">
            Pre-built AI characters ready for instant customization. Create your own or start with ours.
          </p>
        </div>

        {/* Character Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {models.map((model) => (
            <div
              key={model.name}
              className="model-card glass-card overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)]"
              style={{ opacity: 0 }}
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{model.name}</h3>
                  <span className="text-white/60 text-xs uppercase tracking-wider">
                    {model.style}
                  </span>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#8338ec]/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="glass-card max-w-[700px] mx-auto p-8 md:p-10"
        >
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-item text-center" style={{ opacity: 0 }}>
                  <div className="w-10 h-10 rounded-full bg-[#8338ec]/10 flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} className="text-[#8338ec]" />
                  </div>
                  <div className="text-[28px] md:text-[36px] font-semibold text-[#121212] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#888888] mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
