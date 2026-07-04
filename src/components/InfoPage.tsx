import type { ReactNode } from 'react';

type InfoSectionProps = {
  title: string;
  children: ReactNode;
};

export function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.28)] md:p-8">
      <h2 className="mb-5 text-2xl font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <div className="space-y-4 text-[#aaaaaa]">{children}</div>
    </section>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
