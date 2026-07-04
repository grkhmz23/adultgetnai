const WALL_IMAGES = [
  '/images/roadmap-wall-1.svg',
  '/images/roadmap-wall-2.svg',
  '/images/roadmap-wall-3.svg',
  '/images/roadmap-wall-4.svg',
  '/images/roadmap-wall-5.svg',
  '/images/roadmap-wall-6.svg',
  '/images/roadmap-wall-7.svg',
  '/images/roadmap-wall-8.svg',
];

export default function RoadmapSection() {
  return (
    <section id="studio" className="relative py-24 md:py-32" style={{ zIndex: 2 }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-8 md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
          >
            <div className="grid h-full grid-cols-4 gap-3 p-6 md:grid-cols-8 md:gap-4">
              {WALL_IMAGES.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full rounded-xl object-cover"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-[#050505]" />
          </div>

          <div className="relative z-10 mx-auto max-w-[640px] text-center">
            <h2 className="text-[36px] font-semibold leading-tight tracking-[-2px] text-white md:text-[56px]">
              From private chat
              <br />
              <span className="gradient-text">to synthetic media</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[420px] text-sm leading-relaxed text-[#888888] md:text-base">
              Intent captured in live sexting today — structured scenes, still images, and
              short-form video as the AdultGen platform grows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
