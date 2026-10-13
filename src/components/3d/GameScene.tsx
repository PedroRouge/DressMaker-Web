// src/components/3d/GameScene.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import { Mannequin } from './Mannequin';
import { SewingMachineScene } from './SewingMachineScene';

export const GameScene: React.FC = () => {
  const phase = useGameStore((s) => s.phase);
  const isSewing = phase === 'SEW';

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: isSewing ? [0, 1.4, 2.2] : [0, 1.25, 3.4],
          fov: isSewing ? 38 : 42
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#e8618c] border-t-transparent animate-spin" />
              <span className="text-xs text-pink-300 font-bold">Cargando Taller 3D...</span>
            </div>
          </Html>
        }>
          <ambientLight intensity={0.7} />

          {/* Iluminación de estudio */}
          <directionalLight
            castShadow
            position={[3.5, 6, 4]}
            intensity={1.45}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-4, 3, -1]} intensity={0.5} color="#dff9fb" />
          <pointLight position={[0, 4.2, 0]} intensity={0.75} color="#ffeaa7" />

          <Environment preset="studio" />

          {/* RENDERIZADO CONDICIONAL DE LA ESCENA 3D */}
          {isSewing ? (
            <SewingMachineScene />
          ) : (
            <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
              <Mannequin />
            </Float>
          )}

          <ContactShadows
            position={[0, isSewing ? -0.45 : -0.7, 0]}
            opacity={0.65}
            scale={4}
            blur={2.5}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            minDistance={1.8}
            maxDistance={5.2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameScene;
