import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import MeshGradientBackground from '../components/effects/MeshGradientBackground';
import Header from '../sections/Header';
import Hero from '../sections/Hero';
import FeatureShowcase from '../sections/FeatureShowcase';
import ProductStatus from '../sections/ProductStatus';
import Footer from '../sections/Footer';

const InfiniteMediaWall = lazy(() => import('../sections/InfiniteMediaWall'));

function DeferredInfiniteMediaWall() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad || !placeholderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' }
    );

    observer.observe(placeholderRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) {
    return (
      <Suspense fallback={<div className="relative" style={{ height: '300vh' }} />}>
        <InfiniteMediaWall />
      </Suspense>
    );
  }

  return <div ref={placeholderRef} className="relative" style={{ height: '300vh' }} />;
}

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
        <ProductStatus />
        <DeferredInfiniteMediaWall />
        <FeatureShowcase />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
