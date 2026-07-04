const milestones = [
  {
    status: 'Live in private beta',
    title: 'Uncensored sexting chat',
    description:
      'Private sex chat, natural message flow, and a proprietary AdultGen companion model built exclusively for verified adults.',
    accent: '#8338ec',
  },
  {
    status: 'In development',
    title: 'Synthetic image generation',
    description:
      'Consent-first still-image pipeline for fictional adults only — labeled outputs, prompt safety, and no real-person likeness.',
    accent: '#3a86ff',
  },
  {
    status: 'On the roadmap',
    title: 'Synthetic adult video',
    description:
      'Short-form private video from structured scene intent. Built after chat and image layers prove safety and retention.',
    accent: '#f0f0f0',
  },
];

export default function ProductStatus() {
  return (
    <section id="product" className="relative bg-[#080808] py-24 md:py-32" style={{ zIndex: 2 }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8338ec]">
            Product status
          </p>
          <h2 className="text-[36px] font-semibold tracking-[-1.5px] text-white md:text-[52px]">
            Chat is ready.
            <span className="gradient-text"> Media is next.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-[#b0b0b0]">
            AdultGen ships uncensored adult chat today and is expanding into synthetic image and
            video generation — fictional adults only, compliance-first, private by design.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {milestones.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[240px] flex-col rounded-3xl border border-white/[0.14] bg-[#111113] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-300 hover:border-white/25"
              >
                <p
                  className="mb-auto text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: item.accent }}
                >
                  {item.status}
                </p>
                <h3 className="mt-10 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#b0b0b0]">
                  {item.description}
                </p>
              </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('adultgen:open-early-access'))}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Request early access
          </button>
        </div>
      </div>
    </section>
  );
}
