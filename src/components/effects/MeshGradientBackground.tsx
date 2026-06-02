import { useEffect, useRef } from 'react';
import { MainStageController } from './MainStageController';

export default function MeshGradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MainStageController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.id = 'mesh-gradient-canvas';

    const controller = new MainStageController('mesh-gradient-canvas');
    controllerRef.current = controller;
    controller.init();

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
