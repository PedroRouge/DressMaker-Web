// src/components/3d/Mannequin.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

/*
 * ==============================================================================
 * CARGA DE MODELO GLTF EXTERNO (OPCIONAL / CUANDO TENGAS EL ARCHIVO .GLB):
 * Para utilizar un archivo .glb real, descomenta el siguiente bloque e importa useGLTF:
 *
 * import { useGLTF } from '@react-three/drei';
 * 
 * const { scene } = useGLTF('/models/mannequin.glb');
 * return <primitive object={scene} scale={1.5} position={[0, -0.7, 0]} />;
 * 
 * useGLTF.preload('/models/mannequin.glb');
 * ==============================================================================
 */

export const Mannequin: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const phase = useGameStore((s) => s.phase);
  const activeMeasurePart = useGameStore((s) => s.activeMeasurePart);
  const tempMeasureValue = useGameStore((s) => s.tempMeasureValue);
  const design = useGameStore((s) => s.design);
  const selectedFabric = useGameStore((s) => s.selectedFabric);

  // Animación suave de balanceo/rotación tenue
  useFrame((state, delta) => {
    if (groupRef.current && (phase === 'DELIVERY' || phase === 'START')) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const isMeasuring = phase === 'MEASURE';

  // Posición Y y radio de la cinta métrica en el maniquí
  let tapeY = 1.46; // Bust / Pecho
  let tapeRadius = 0.285;
  if (activeMeasurePart === 'waist') {
    tapeY = 1.16; // Cintura
    tapeRadius = 0.215;
  } else if (activeMeasurePart === 'hips') {
    tapeY = 0.82; // Cadera
    tapeRadius = 0.325;
  }

  const adjustedRadius = tapeRadius + (tempMeasureValue - 85) * 0.0012;

  // Material de la prenda seleccionada
  const dressMaterialProps = {
    color: selectedFabric.color,
    roughness: selectedFabric.roughness,
    metalness: selectedFabric.metalness,
    side: THREE.DoubleSide
  };

  return (
    <group ref={groupRef} position={[0, -0.65, 0]}>
      {/* --- BASE Y SOPORTE DE MADERA ATELIER --- */}
      <mesh position={[0, -0.85, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.42, 0.08, 32]} />
        <meshStandardMaterial color="#54301a" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.3, 16]} />
        <meshStandardMaterial color="#7a4624" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* --- REMATE SUPERIOR DEL CUELLO (Madera Torneada) --- */}
      <group position={[0, 1.96, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.08, 24]} />
          <meshStandardMaterial color="#7a4624" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#7a4624" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* --- CUERPO DEL MANIQUÍ (Tela de lino acolchada tono crudo) --- */}
      {/* Cuello */}
      <mesh position={[0, 1.83, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.16, 24]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* Hombros */}
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.29, 0.22, 32]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* Pecho y Busto Femenino */}
      <mesh position={[0, 1.46, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.29, 0.24, 0.22, 32]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 1.47, 0.11]} rotation={[0.2, -0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 1.47, 0.11]} rotation={[0.2, 0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* Cintura */}
      <mesh position={[0, 1.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.21, 0.32, 32]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* Caderas y Muslos */}
      <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.21, 0.325, 0.35, 32]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.325, 0.23, 0.42, 32]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* --- CINTA MÉTRICA AMARILLA INTERACTIVA (EN FASE 'MEASURE') --- */}
      {isMeasuring && (
        <group position={[0, tapeY, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[adjustedRadius, 0.024, 16, 64]} />
            <meshStandardMaterial
              color="#f6c344"
              roughness={0.25}
              metalness={0.3}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Broche / Cursor metálico frontal */}
          <mesh position={[0, 0, adjustedRadius + 0.012]} castShadow>
            <boxGeometry args={[0.07, 0.05, 0.025]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* --- VESTIDO MODULAR 3D (DESDE FASE 'DESIGN' EN ADELANTE) --- */}
      {phase !== 'START' && phase !== 'MEASURE' && (
        <group>
          {/* CORPIÑO */}
          {design.cut === 'entallado' && (
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.292, 0.225, 0.46, 32]} />
              <meshStandardMaterial {...dressMaterialProps} />
            </mesh>
          )}

          {design.cut === 'recto' && (
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.288, 0.26, 0.46, 32]} />
              <meshStandardMaterial {...dressMaterialProps} />
            </mesh>
          )}

          {design.cut === 'peplum' && (
            <group position={[0, 1.4, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.29, 0.22, 0.46, 32]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
              {/* Volante peplum en la cintura */}
              <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.38, 0.16, 32, 1, true]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
            </group>
          )}

          {design.cut === 'imperio' && (
            <group position={[0, 1.4, 0]}>
              <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.29, 0.24, 0.3, 32]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
              {/* Cinta imperio decorativa */}
              <mesh position={[0, -0.06, 0]} castShadow>
                <cylinderGeometry args={[0.245, 0.245, 0.04, 32]} />
                <meshStandardMaterial color="#f6c344" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* ESCOTE */}
          {design.neckline === 'redondo' && (
            <mesh position={[0, 1.66, 0.1]} rotation={[0.3, 0, 0]}>
              <torusGeometry args={[0.13, 0.018, 16, 24, Math.PI]} />
              <meshStandardMaterial color="#3f2237" roughness={0.6} />
            </mesh>
          )}
          {design.neckline === 'corazon' && (
            <mesh position={[0, 1.61, 0.11]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.14, 0.02, 16, 24, Math.PI * 0.85]} />
              <meshStandardMaterial color="#e8618c" roughness={0.4} />
            </mesh>
          )}
          {design.neckline === 'enV' && (
            <mesh position={[0, 1.6, 0.1]} rotation={[0.5, 0, 0]}>
              <coneGeometry args={[0.14, 0.2, 3]} />
              <meshStandardMaterial color="#3f2237" roughness={0.6} />
            </mesh>
          )}

          {/* FALDA (Según el largo de falda seleccionado) */}
          {design.skirtLength === 'corta' && (
            <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.38, 0.45, 32, 1, true]} />
              <meshStandardMaterial {...dressMaterialProps} />
            </mesh>
          )}

          {design.skirtLength === 'midi' && (
            <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.44, 0.8, 32, 1, true]} />
              <meshStandardMaterial {...dressMaterialProps} />
            </mesh>
          )}

          {design.skirtLength === 'larga' && (
            <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.68, 1.15, 32, 1, true]} />
              <meshStandardMaterial {...dressMaterialProps} />
            </mesh>
          )}

          {/* MANGAS */}
          {design.sleeve === 'corta' && (
            <>
              <mesh position={[-0.29, 1.58, 0]} rotation={[0, 0, 0.3]} castShadow>
                <cylinderGeometry args={[0.07, 0.085, 0.18, 16]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
              <mesh position={[0.29, 1.58, 0]} rotation={[0, 0, -0.3]} castShadow>
                <cylinderGeometry args={[0.07, 0.085, 0.18, 16]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
            </>
          )}

          {design.sleeve === 'abullonada' && (
            <>
              <mesh position={[-0.31, 1.62, 0]} castShadow>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
              <mesh position={[0.31, 1.62, 0]} castShadow>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial {...dressMaterialProps} />
              </mesh>
            </>
          )}
        </group>
      )}
    </group>
  );
};

export default Mannequin;
