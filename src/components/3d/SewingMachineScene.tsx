// src/components/3d/SewingMachineScene.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const SewingMachineScene: React.FC = () => {
  const needleRef = useRef<THREE.Mesh>(null);
  const handwheelRef = useRef<THREE.Mesh>(null);
  const fabricMoverRef = useRef<THREE.Group>(null);

  const sewingMode = useGameStore((s) => s.sewingMode);
  const sewingLineProgress = useGameStore((s) => s.sewingLineProgress);
  const sewingDeviance = useGameStore((s) => s.sewingDeviance);
  const advanceSewing = useGameStore((s) => s.advanceSewing);
  const selectedFabric = useGameStore((s) => s.selectedFabric);

  // Animación del movimiento de aguja y volante
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isMoving = sewingLineProgress > 0 && sewingLineProgress < 100;

    if (needleRef.current) {
      // Subida y bajada rápida de la aguja al coser
      const speed = isMoving ? 25 : 0;
      needleRef.current.position.y = 0.52 + Math.sin(time * speed) * 0.04;
    }

    if (handwheelRef.current) {
      // Giro del volante lateral
      if (isMoving) {
        handwheelRef.current.rotation.x += 0.2;
      }
    }

    if (fabricMoverRef.current) {
      // Desplazamiento de la tela debajo del prensatelas
      fabricMoverRef.current.position.z = -((sewingLineProgress / 100) * 1.2);
      fabricMoverRef.current.position.x = (sewingDeviance / 10) * 0.3;
    }
  });

  // Modo Manual: Escucha teclado (Espacio para avanzar, Flechas para guiar)
  useEffect(() => {
    if (sewingMode !== 'manual') return;

    let deviance = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        deviance = Math.max(-10, deviance - 1.5);
      } else if (e.code === 'ArrowRight') {
        deviance = Math.min(10, deviance + 1.5);
      } else if (e.code === 'Space') {
        e.preventDefault();
        // Deriva natural simulada
        deviance += (Math.random() - 0.5) * 1.2;
        advanceSewing(deviance);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sewingMode, advanceSewing]);

  return (
    <group position={[0, -0.4, 0]}>
      {/* =========================================================================
          MESA DE TRABAJO DE SASTRERÍA (Madera de nogal barnizada)
         ========================================================================= */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.12, 2.2]} />
        <meshStandardMaterial color="#4a2e1b" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Regla milimétrica empotrada en el borde de la mesa */}
      <mesh position={[0, -0.08, 0.9]} receiveShadow>
        <boxGeometry args={[2.4, 0.01, 0.08]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* =========================================================================
          MÁQUINA DE COSER 3D (Cuerpo negro brillante, latón y aguja de acero)
         ========================================================================= */}
      {/* Placa metálica de la aguja */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[0.42, 0.02, 0.55]} />
        <meshStandardMaterial color="#dfe4ea" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Ranura del prensatelas */}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[0.04, 0.02, 0.12]} />
        <meshStandardMaterial color="#2f3542" />
      </mesh>

      {/* Base / Montante vertical de la máquina */}
      <mesh position={[0.55, 0.45, 0]} castShadow>
        <boxGeometry args={[0.22, 0.95, 0.38]} />
        <meshStandardMaterial color="#1e272e" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Brazo superior horizontal */}
      <mesh position={[0.18, 0.82, 0]} castShadow>
        <boxGeometry args={[0.82, 0.22, 0.3]} />
        <meshStandardMaterial color="#1e272e" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Cabezal de costura frontal */}
      <mesh position={[-0.26, 0.72, 0]} castShadow>
        <boxGeometry args={[0.24, 0.36, 0.28]} />
        <meshStandardMaterial color="#1e272e" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Barra de la aguja metálica con amortiguador */}
      <mesh ref={needleRef} position={[-0.26, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.28, 16]} />
        <meshStandardMaterial color="#f1f2f6" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Prensatelas */}
      <mesh position={[-0.26, 0.44, 0]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.08]} />
        <meshStandardMaterial color="#ced6e0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Volante de giro lateral (Handwheel) */}
      <mesh ref={handwheelRef} position={[0.68, 0.75, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Bobina de hilo superior */}
      <group position={[0.35, 1.02, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 24]} />
          <meshStandardMaterial color="#e8618c" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.22, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      </group>

      {/* =========================================================================
          PIEZA DE TELA MÓVIL BAJO EL PRENSATELAS
         ========================================================================= */}
      <group ref={fabricMoverRef} position={[-0.26, -0.06, 0]}>
        {/* Tela seleccionada */}
        <mesh receiveShadow>
          <boxGeometry args={[0.7, 0.015, 1.2]} />
          <meshStandardMaterial
            color={selectedFabric.baseColor}
            roughness={selectedFabric.roughness}
            metalness={selectedFabric.metalness}
          />
        </mesh>

        {/* Línea punteada de guía de costura */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[0.015, 1.15]} />
          <meshBasicMaterial color="#341f97" wireframe />
        </mesh>

        {/* Pespunte cosido realizado */}
        <mesh position={[0, 0.012, 0.6 - (sewingLineProgress / 100) * 0.6]}>
          <planeGeometry args={[0.012, (sewingLineProgress / 100) * 1.2]} />
          <meshBasicMaterial color="#e8618c" />
        </mesh>
      </group>
    </group>
  );
};

export default SewingMachineScene;
