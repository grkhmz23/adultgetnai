import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  '/images/roadmap-wall-1.svg',
  '/images/roadmap-wall-2.svg',
  '/images/roadmap-wall-3.svg',
  '/images/roadmap-wall-4.svg',
  '/images/roadmap-wall-5.svg',
  '/images/roadmap-wall-6.svg',
  '/images/roadmap-wall-7.svg',
  '/images/roadmap-wall-8.svg',
];

export default function InfiniteMediaWall() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    // Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0.3, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    canvas.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create tile group
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Load textures and create tiles
    const loader = new THREE.TextureLoader();
    const gridSize = 4;
    const [xMin, xMax] = [-1.5, 1.5];
    const [zMin, zMax] = [-1.5, 1.5];
    const totalWidth = xMax - xMin;
    const totalDepth = zMax - zMin;
    const spacingX = totalWidth / gridSize;
    const spacingZ = totalDepth / gridSize;
    const imageCount = IMAGES.length;
    const tileCountX = 4;
    // tileCountZ = 4 implied by grid dimensions
    const centerX = -((tileCountX - 1) * spacingX) / 2;

    interface TileData {
      id: string;
      x: number;
      z: number;
      image: string;
    }

    const tiles: TileData[] = [];
    for (let ix = 0; ix < tileCountX; ix++) {
      for (let iz = -100; iz <= 100; iz++) {
        tiles.push({
          id: `${ix}-${iz}`,
          x: centerX + ix * spacingX,
          z: iz * spacingZ,
          image: IMAGES[Math.abs((ix * 7 + iz * 13) % imageCount)],
        });
      }
    }

    // Create meshes
    const geometry = new THREE.PlaneGeometry(0.35, 0.45);
    const tileMeshes: THREE.Mesh[] = [];

    tiles.forEach((tile) => {
      const texture = loader.load(tile.image);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(tile.x, 0, tile.z);
      group.add(mesh);
      tileMeshes.push(mesh);
    });

    // ScrollTrigger
    const scrollTarget = { z: -48 };
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;
        camera.position.z = progress * scrollTarget.z;
      },
    });

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      group.position.x = Math.sin(camera.position.z * 0.5) * 0.3;
      group.position.y = Math.sin(camera.position.z * 0.3) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // Overlay animation
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true,
          },
        }
      );
    }

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      st.kill();
      renderer.dispose();
      geometry.dispose();
      tileMeshes.forEach((m) => {
        (m.material as THREE.MeshBasicMaterial).dispose();
      });
      if (canvas.contains(renderer.domElement)) {
        canvas.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} id="studio" className="relative" style={{ height: '300vh' }}>
      <div
        ref={canvasRef}
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Center overlay card */}
        <div
          ref={overlayRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ opacity: 0 }}
        >
          <div className="glass-card px-10 py-8 md:px-16 md:py-12 text-center">
            <h2
              className="text-[36px] md:text-[56px] font-semibold tracking-[-2px] text-[#121212] leading-tight"
              style={{
                textShadow: '0 2px 20px rgba(255,255,255,0.8)',
              }}
            >
              Private Intent
              <br />
              <span className="gradient-text">To Synthetic Video</span>
            </h2>
            <p className="text-sm text-[#888888] mt-3 max-w-[280px] mx-auto">
              A consent-first roadmap from verified identity to structured scene direction and future private adult video generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
