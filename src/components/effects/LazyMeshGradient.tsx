import { lazy, Suspense, useEffect, useState } from 'react';

const MeshGradientBackground = lazy(() => import('./MeshGradientBackground'));

export default function LazyMeshGradient() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const enable = () => setEnabled(true);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = setTimeout(enable, 800);
    return () => clearTimeout(timeout);
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <MeshGradientBackground />
    </Suspense>
  );
}