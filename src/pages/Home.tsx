import Header from '../sections/Header';
import Hero from '../sections/Hero';
import FeatureShowcase from '../sections/FeatureShowcase';
import ProductStatus from '../sections/ProductStatus';
import Footer from '../sections/Footer';
import LazyMeshGradient from '../components/effects/LazyMeshGradient';
import { usePageMeta } from '../hooks/use-page-meta';

export default function Home() {
  usePageMeta({
    title: 'AdultGen AI — Uncensored AI Chat, AI Sexting & Adult Content Generation',
    description:
      'AdultGen AI is an 18+ platform for private AI sexting, erotic roleplay, and synthetic porn generation for consenting adults.',
    canonical: 'https://adultgen.fun',
  });
  return (
    <div className="relative min-h-screen bg-[#050505]">
      <LazyMeshGradient />
      <Header />

      <main className="relative">
        <Hero />
        <ProductStatus />
        <FeatureShowcase />
      </main>

      <Footer />
    </div>
  );
}
