import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Modelo GLTF de ejemplo. Colócalo en `public/models/dress.glb`.
 */
export default function DressModel() {
  const { scene } = useGLTF('/models/dress.glb');
  const ref = useRef();

  // Rotación lenta para mostrar el modelo
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Pre‑carga para mejorar la experiencia de carga inicial
useGLTF.preload('/models/dress.glb');
