import type { ReactNode } from 'react';
import Footer from '../sections/Footer';
import Header from '../sections/Header';
import { usePageMeta } from '../hooks/use-page-meta';

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
};

export default function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  usePageMeta({ title, description });

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="relative pt-[120px] pb-20" style={{ zIndex: 2 }}>
        <section className="mx-auto max-w-[920px] px-6">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#8338ec]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[42px] font-semibold leading-tight tracking-[-2px] text-white md:text-[64px]">
            {title}
          </h1>
          <div className="mt-10 space-y-8 text-base leading-8 text-[#aaaaaa]">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
