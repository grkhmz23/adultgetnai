import * as THREE from 'three';
import { GradientShaderLib } from './GradientShaderLib';

export class IcosahedronMesh {
  mesh: THREE.Mesh;
  geometry: THREE.IcosahedronGeometry;
  material: THREE.ShaderMaterial;
  uniforms: Record<string, { value: unknown }>;

  constructor() {
    this.uniforms = {
      uTime: { value: 0.0 },
      uDistortion: { value: 1.5 },
      uFrequency: { value: 0.6 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      color1: { value: new THREE.Color('#efefef') },
      color2: { value: new THREE.Color('#8338ec') },
      color3: { value: new THREE.Color('#3a86ff') },
      color4: { value: new THREE.Color('#ff006e') },
      color5: { value: new THREE.Color('#cecece') },
    };

    this.geometry = new THREE.IcosahedronGeometry(1.5, 64);
    this.material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      depthWrite: false,
      vertexShader: GradientShaderLib.vertexShader(),
      fragmentShader: GradientShaderLib.fragmentShader(),
      uniforms: this.uniforms,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
  }

  animate(elapsedTime: number): void {
    this.mesh.rotation.y = elapsedTime * 0.05;
    this.uniforms.uTime.value = elapsedTime;
  }

  updateMouse(clientX: number, clientY: number, width: number, height: number): void {
    const x = clientX / width;
    const y = 1.0 - (clientY / height);
    (this.uniforms.uMouse.value as THREE.Vector2).set(x, y);
  }

  render(): THREE.Mesh {
    return this.mesh;
  }
}
