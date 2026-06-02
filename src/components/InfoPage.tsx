import type { ReactNode } from 'react';

type InfoSectionProps = {
  title: string;
  children: ReactNode;
};

export function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="rounded-[8px] border border-black/8 bg-white/75 p-6 md:p-8 shadow-[0_16px_60px_rgba(0,0,0,0.04)]">
      <h2 className="mb-5 text-2xl font-semibold tracking-[-0.02em] text-[#121212]">
        {title}
      </h2>
      <div className="space-y-4 text-[#555555]">{children}</div>
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

