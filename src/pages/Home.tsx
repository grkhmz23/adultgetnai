import MeshGradientBackground from '../components/effects/MeshGradientBackground';
import Header from '../sections/Header';
import Hero from '../sections/Hero';
import InfiniteMediaWall from '../sections/InfiniteMediaWall';
import FeatureShowcase from '../sections/FeatureShowcase';
import FlipReveal from '../sections/FlipReveal';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#fbfbfb]">
      {/* Fixed WebGL Background */}
      <MeshGradientBackground />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <InfiniteMediaWall />
        <FeatureShowcase />
        <FlipReveal />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
