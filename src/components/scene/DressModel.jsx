import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore.js';
import * as THREE from 'three';

export default function DressModel() {
  const groupRef = useRef();
  const dressColor = useGameStore((s) => s.dressColor);
  const secondaryColor = useGameStore((s) => s.secondaryColor);
  const fabricType = useGameStore((s) => s.fabricType);
  const dressCut = useGameStore((s) => s.dressCut);
  const hasBelt = useGameStore((s) => s.hasBelt);
  const hasNecklace = useGameStore((s) => s.hasNecklace);
  const autoRotate = useGameStore((s) => s.autoRotate);

  // Animación suave de rotación
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Configuración de materiales según el tipo de tela seleccionado
  const materialProps = {
    roughness: fabricType === 'satin' ? 0.2 : fabricType === 'velvet' ? 0.85 : 0.6,
    metalness: fabricType === 'satin' ? 0.35 : fabricType === 'velvet' ? 0.05 : 0.1,
    clearcoat: fabricType === 'satin' ? 0.8 : 0.0,
    clearcoatRoughness: 0.15
  };

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* --- STAND / SOPORTE DEL MANIQUÍ (Madera y Latón) --- */}
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.08, 32]} />
        <meshStandardMaterial color="#2d3436" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Poste central */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Remate superior del maniquí */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* --- CUERPO DEL MANIQUÍ (Torso de costura acolchado) --- */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.6, 24]} />
        <meshStandardMaterial color="#f7f1e3" roughness={0.9} />
      </mesh>

      {/* --- CORSET / TOP DEL VESTIDO --- */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.19, 0.5, 32]} />
        <meshPhysicalMaterial
          color={dressColor}
          {...materialProps}
        />
      </mesh>

      {/* Pechera / Escote detalle */}
      <mesh position={[0, 1.72, 0.08]} rotation={[0.4, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.04, 16, 32, Math.PI]} />
        <meshPhysicalMaterial
          color={secondaryColor}
          {...materialProps}
        />
      </mesh>

      {/* --- CINTURÓN (Opcional) --- */}
      {hasBelt && (
        <group position={[0, 1.25, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.205, 0.205, 0.06, 32]} />
            <meshStandardMaterial color="#ffd32a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Hebilla */}
          <mesh position={[0, 0, 0.21]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshStandardMaterial color="#ffa801" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      )}

      {/* --- COLLAR (Opcional) --- */}
      {hasNecklace && (
        <mesh position={[0, 1.75, 0]} rotation={[1.3, 0, 0]} castShadow>
          <torusGeometry args={[0.18, 0.015, 16, 32]} />
          <meshStandardMaterial color="#fffa65" metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* --- FALDA DEL VESTIDO (Según el corte seleccionado) --- */}
      {dressCut === 'flair' && (
        <group position={[0, 0.75, 0]}>
          {/* Falda acampanada con vuelo */}
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.7, 1.0, 32, 1, true]} />
            <meshPhysicalMaterial
              color={dressColor}
              side={THREE.DoubleSide}
              {...materialProps}
            />
          </mesh>
          {/* Borde inferior decorativo */}
          <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.68, 0.03, 16, 32]} />
            <meshPhysicalMaterial
              color={secondaryColor}
              {...materialProps}
            />
          </mesh>
        </group>
      )}

      {dressCut === 'princess' && (
        <group position={[0, 0.65, 0]}>
          {/* Falda de princesa voluminosa */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshPhysicalMaterial
              color={dressColor}
              side={THREE.DoubleSide}
              {...materialProps}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.72, 0.76, 0.35, 32, 1, true]} />
            <meshPhysicalMaterial
              color={secondaryColor}
              side={THREE.DoubleSide}
              {...materialProps}
            />
          </mesh>
        </group>
      )}

      {dressCut === 'sleek' && (
        <group position={[0, 0.75, 0]}>
          {/* Falda entallada elegante */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.38, 1.0, 32, 1, true]} />
            <meshPhysicalMaterial
              color={dressColor}
              side={THREE.DoubleSide}
              {...materialProps}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
