import { MessageCircle, Sparkles, Video } from 'lucide-react';

const milestones = [
  {
    icon: MessageCircle,
    status: 'Live in private beta',
    title: 'Uncensored sexting chat',
    description:
      '38 fictional adult personas, WhatsApp-style bubbles, and MLX-backed replies for verified adults with private credentials.',
    accent: '#8338ec',
  },
  {
    icon: Sparkles,
    status: 'In development · seeking investors',
    title: 'Synthetic image generation',
    description:
      'Consent-first still-image pipeline for fictional adults only — labeled outputs, prompt safety, and no real-person likeness.',
    accent: '#3a86ff',
  },
  {
    icon: Video,
    status: 'Roadmap · seeking investors',
    title: 'Synthetic adult video',
    description:
      'Short-form private video from structured scene intent. Built after chat and image layers prove safety and retention.',
    accent: '#121212',
  },
];

export default function ProductStatus() {
  return (
    <section id="product" className="relative bg-[#fbfbfb] py-24 md:py-32" style={{ zIndex: 2 }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8338ec]">
            Product status
          </p>
          <h2 className="text-[36px] font-semibold tracking-[-1.5px] text-[#121212] md:text-[52px]">
            Chat is ready.
            <span className="gradient-text"> Media is next.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-[#888888]">
            AdultGen ships uncensored adult chat today while we raise for synthetic image and video
            generation — fictional adults only, compliance-first, private by design.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {milestones.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="glass-card flex flex-col p-6 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${item.accent}14` }}
                >
                  <Icon size={20} style={{ color: item.accent }} />
                </div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: item.accent }}
                >
                  {item.status}
                </p>
                <h3 className="text-lg font-semibold text-[#121212]">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#888888]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/chat"
            className="rounded-full bg-[#121212] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Open private chat
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('adultgen:open-early-access'))}
            className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[#121212] transition-all duration-300 hover:bg-white"
          >
            Investor & early access
          </button>
        </div>
      </div>
    </section>
  );
}