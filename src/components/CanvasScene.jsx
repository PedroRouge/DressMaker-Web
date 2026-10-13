import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore.js';
import DressModel from './scene/DressModel.jsx';

export default function CanvasScene() {
  const cameraPosition = useGameStore((s) => s.cameraPosition);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-radial from-slate-800/80 via-slate-900/90 to-slate-950">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: cameraPosition, fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={<Html center><div className="text-white font-semibold animate-pulse">Cargando Atelier 3D...</div></Html>}>
          <ambientLight intensity={0.7} />
          
          {/* Luz principal cálida */}
          <directionalLight
            castShadow
            position={[4, 6, 4]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          
          {/* Luz de relleno suave */}
          <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#74b9ff" />
          
          {/* Luz de acento superior */}
          <pointLight position={[0, 4, 0]} intensity={0.8} color="#ffeaa7" />

          {/* Maniquí / Vestido con flotación sutil */}
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
            <DressModel />
          </Float>

          {/* Sombra de contacto realista en el suelo */}
          <ContactShadows
            position={[0, -0.65, 0]}
            opacity={0.7}
            scale={4}
            blur={2.4}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
