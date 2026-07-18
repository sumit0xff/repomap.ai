"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleData {
  t: number;
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  mx: number;
  my: number;
}

function Particles() {
  const count = 150;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [particles] = useState<ParticleData[]>(() => {
    const temp: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  });

  useFrame(() => {
    if (!mesh.current || particles.length === 0) return;
    
    particles.forEach((particle, i) => {
      const factor = particle.factor;
      const speed = particle.speed;
      const xFactor = particle.xFactor;
      const yFactor = particle.yFactor;
      const zFactor = particle.zFactor;
      
      particle.t += speed / 2;
      const t = particle.t;

      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#4d4da8" transparent opacity={0.3} />
      </instancedMesh>
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none mix-blend-screen hidden md:block">
      <Canvas camera={{ fov: 75, position: [0, 0, 30] }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
