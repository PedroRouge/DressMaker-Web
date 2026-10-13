// src/components/3d/GameScene.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { Mannequin } from './Mannequin';

export const GameScene: React.FC = () => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.25, 3.5], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#e8618c] border-t-transparent animate-spin" />
              <span className="text-xs text-pink-300 font-bold">Cargando Atelier 3D...</span>
            </div>
          </Html>
        }>
          {/* Iluminación de Estudio de Moda */}
          <ambientLight intensity={0.65} />

          {/* Luz clave cálida frontal */}
          <directionalLight
            castShadow
            position={[3.5, 6, 4.5]}
            intensity={1.4}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />

          {/* Luz de relleno suave y fría desde la izquierda */}
          <directionalLight position={[-4, 3, -1]} intensity={0.5} color="#dff9fb" />

          {/* Luz cenital dorada */}
          <pointLight position={[0, 4.5, 0]} intensity={0.7} color="#ffeaa7" />

          {/* Entorno Studio de Drei */}
          <Environment preset="studio" />

          {/* Maniquí estilizado con leve flotación natural */}
          <Float speed={1} rotationIntensity={0.06} floatIntensity={0.12}>
            <Mannequin />
          </Float>

          {/* Sombra de contacto realista en el suelo */}
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.65}
            scale={4}
            blur={2.5}
            far={4}
          />

          {/* Controles de cámara orbitales suaves */}
          <OrbitControls
            enablePan={false}
            minDistance={2.2}
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
