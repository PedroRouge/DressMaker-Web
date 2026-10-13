import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore.js';
import DressModel from './scene/DressModel.jsx';

export default function CanvasScene() {
  const { cameraPosition } = useGameStore();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraPosition, fov: 45 }}
      className="rounded-xl bg-gray-900/50 backdrop-blur-xs shadow-glass"
    >
      <color attach="background" args={['#1a1a1a']} />
      <Suspense fallback={<Html center>Loading…</Html>}>
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Environment preset="city" />
        <DressModel />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Suspense>
    </Canvas>
  );
}
