import * as THREE from 'three';
import { IcosahedronMesh } from './IcosahedronMesh';

export class MainStageController {
  el: HTMLElement | null;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  timer: number;
  clock: THREE.Clock;
  ico: IcosahedronMesh;
  mouseX: number;
  mouseY: number;
  private _onMouseMove: (event: MouseEvent) => void;
  private _onResize: () => void;
  private _rafId: number | null = null;

  constructor(canvasId: string) {
    this.el = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (this.el) {
      this.el.appendChild(this.renderer.domElement);
    }

    this.camera.position.z = 5;
    this.timer = 0;
    this.clock = new THREE.Clock();
    this.ico = new IcosahedronMesh();
    this.scene.add(this.ico.render());
    this.mouseX = 0;
    this.mouseY = 0;

    this._onMouseMove = this.onMouseMove.bind(this);
    this._onResize = this.onResize.bind(this);

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('resize', this._onResize);
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.ico.updateMouse(this.mouseX, this.mouseY, window.innerWidth, window.innerHeight);
  }

  onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate(): void {
    this._rafId = requestAnimationFrame(this.animate.bind(this));
    this.timer = this.clock.getElapsedTime();
    this.ico.animate(this.timer);
    this.renderer.render(this.scene, this.camera);
  }

  init(): void {
    this.animate();
  }

  destroy(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
    }
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);
    this.ico.geometry.dispose();
    this.ico.material.dispose();
    this.renderer.dispose();
  }
}
