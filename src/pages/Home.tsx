import Header from '../sections/Header';
import Hero from '../sections/Hero';
import FeatureShowcase from '../sections/FeatureShowcase';
import ProductStatus from '../sections/ProductStatus';
import RoadmapSection from '../sections/RoadmapSection';
import Footer from '../sections/Footer';
import LazyMeshGradient from '../components/effects/LazyMeshGradient';

export default function Home() {
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