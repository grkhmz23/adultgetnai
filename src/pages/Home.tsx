import Header from '../sections/Header';
import Hero from '../sections/Hero';
import FeatureShowcase from '../sections/FeatureShowcase';
import ProductStatus from '../sections/ProductStatus';
import RoadmapSection from '../sections/RoadmapSection';
import Footer from '../sections/Footer';
import LazyMeshGradient from '../components/effects/LazyMeshGradient';
import { usePageMeta } from '../hooks/use-page-meta';

export default function Home() {
  usePageMeta({
    title: 'AdultGen AI — Uncensored AI Chat, AI Sexting & Adult Content Generation',
    description:
      'AdultGen AI is the uncensored AI chat platform for verified adults. Private AI sexting, NSFW AI chatbot, AI porn generator, adult roleplay with 38+ fictional personas. No filters, no refusals — 100% unrestricted adult AI.',
    canonical: 'https://adultgen.fun',
  });
  return (
    <div className="relative min-h-screen bg-[#fbfbfb]">
      <LazyMeshGradient />
      <Header />

      <main className="relative">
        <Hero />
        <ProductStatus />
        <RoadmapSection />
        <FeatureShowcase />
      </main>

      <Footer />
    </div>
  );
}