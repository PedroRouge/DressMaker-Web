// src/components/3d/Mannequin.tsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { createFabricTexture } from '../../utils/textureGenerator';

/*
 * CARGA DE MODELO GLTF EXTERNO (OPCIONAL):
 * Para utilizar un archivo .glb real, descomenta el siguiente bloque:
 *
 * import { useGLTF } from '@react-three/drei';
 * const { scene } = useGLTF('/models/mannequin.glb');
 * return <primitive object={scene} scale={1.5} position={[0, -0.7, 0]} />;
 * useGLTF.preload('/models/mannequin.glb');
 */

export const Mannequin: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const phase = useGameStore((s) => s.phase);
  const activeMeasurePart = useGameStore((s) => s.activeMeasurePart);
  const tempMeasureValue = useGameStore((s) => s.tempMeasureValue);
  const design = useGameStore((s) => s.design);
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const decorations = useGameStore((s) => s.decorations);

  // Animación de rotación suave en pantalla de entrega o inicio
  useFrame((_, delta) => {
    if (groupRef.current && (phase === 'DELIVERY' || phase === 'START')) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Generación de textura de tela procedural de alta resolución
  const fabricTexture = useMemo(() => {
    return createFabricTexture(
      selectedFabric.patternType,
      selectedFabric.baseColor,
      selectedFabric.secondaryColor
    );
  }, [selectedFabric]);

  // Generación anatómica suave del maniquí femenino usando curvas de revolución (LatheGeometry)
  const mannequinGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Perfil suave de sastre: base del torso -> caderas -> cintura -> busto -> hombros -> cuello
    points.push(new THREE.Vector2(0.12, 0.28)); // base pelvis
    points.push(new THREE.Vector2(0.26, 0.45)); // caderas bajas
    points.push(new THREE.Vector2(0.29, 0.65)); // mayor ancho de cadera
    points.push(new THREE.Vector2(0.24, 0.85)); // cintura alta
    points.push(new THREE.Vector2(0.19, 1.05)); // cintura entallada
    points.push(new THREE.Vector2(0.23, 1.25)); // bajo busto
    points.push(new THREE.Vector2(0.28, 1.42)); // busto femenino
    points.push(new THREE.Vector2(0.24, 1.58)); // sobre busto / pecho
    points.push(new THREE.Vector2(0.26, 1.68)); // hombros
    points.push(new THREE.Vector2(0.13, 1.76)); // clavícula
    points.push(new THREE.Vector2(0.09, 1.9));  // cuello
    points.push(new THREE.Vector2(0.0, 1.92));  // tope del cuello

    const spline = new THREE.SplineCurve(points);
    const splinePoints = spline.getPoints(48);
    return new THREE.LatheGeometry(splinePoints, 48);
  }, []);

  const isMeasuring = phase === 'MEASURE';

  // Altura y radio de la cinta métrica
  let tapeY = 1.42; // Pecho
  let tapeRadius = 0.282;
  if (activeMeasurePart === 'waist') {
    tapeY = 1.05; // Cintura
    tapeRadius = 0.195;
  } else if (activeMeasurePart === 'hips') {
    tapeY = 0.65; // Cadera
    tapeRadius = 0.292;
  }

  const adjustedTapeRadius = tapeRadius + (tempMeasureValue - 88) * 0.0015;

  return (
    <group ref={groupRef} position={[0, -0.65, 0]}>
      {/* =========================================================================
          SOPORTE DE PIE METÁLICO CON BASE Y MÁSTIL DE LATÓN / ACERO BRUÑIDO
         ========================================================================= */}
      <mesh position={[0, -0.85, 0]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.06, 36]} />
        <meshStandardMaterial color="#2d3436" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Mástil metálico cromado/dorado */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 1.35, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.035, 0.12, 24]} />
        <meshStandardMaterial color="#b38f29" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* =========================================================================
          CUELLO CON BASE Y PERILLA DE MADERA NOBLE TORNEADA
         ========================================================================= */}
      <group position={[0, 1.9, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.12, 0.08, 32]} />
          <meshStandardMaterial color="#54301a" roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.06, 24, 24]} />
          <meshStandardMaterial color="#b38f29" roughness={0.2} metalness={0.85} />
        </mesh>
      </group>

      {/* =========================================================================
          TORSO DEL MANIQUÍ (Malla Orgánica con Textura de Lino Crudo Acolchado)
         ========================================================================= */}
      <mesh geometry={mannequinGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#ebdccb"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* Relieve del Busto Esculpido Femenino */}
      <mesh position={[-0.09, 1.41, 0.13]} rotation={[0.22, -0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.11, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.85} />
      </mesh>
      <mesh position={[0.09, 1.41, 0.13]} rotation={[0.22, 0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.11, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.85} />
      </mesh>

      {/* Costuras Francesas de sastre en relieve sobre el maniquí */}
      <mesh position={[0, 1.05, 0.005]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.192, 0.005, 12, 36]} />
        <meshStandardMaterial color="#d4c0ab" roughness={0.9} />
      </mesh>

      {/* =========================================================================
          CINTA MÉTRICA VIRTUAL FLEXIBLE (EN FASE 'MEASURE')
         ========================================================================= */}
      {isMeasuring && (
        <group position={[0, tapeY, 0]}>
          {/* Tira circular graduada con textura amarilla de sastre */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[adjustedTapeRadius, 0.022, 16, 64]} />
            <meshStandardMaterial
              color="#f6c344"
              roughness={0.3}
              metalness={0.15}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Broche / Hebilla metálica corrediza frontal con marcas */}
          <mesh position={[0, 0, adjustedTapeRadius + 0.012]} castShadow>
            <boxGeometry args={[0.065, 0.048, 0.022]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* =========================================================================
          PRENDAS REALISTAS CON TEXTURAS Y ESTAMPADOS REALES
         ========================================================================= */}
      {phase !== 'START' && phase !== 'ORDER' && phase !== 'MEASURE' && phase !== 'CUT' && phase !== 'SEW' && (
        <group>
          {/* CORPIÑO DE ALTA COSTURA */}
          {design.cut === 'entallado' && (
            <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.285, 0.205, 0.56, 36]} />
              <meshStandardMaterial
                map={fabricTexture}
                roughness={selectedFabric.roughness}
                metalness={selectedFabric.metalness}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {design.cut === 'recto' && (
            <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.27, 0.24, 0.56, 36]} />
              <meshStandardMaterial
                map={fabricTexture}
                roughness={selectedFabric.roughness}
                metalness={selectedFabric.metalness}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {design.cut === 'peplum' && (
            <group position={[0, 1.35, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.285, 0.205, 0.54, 36]} />
                <meshStandardMaterial
                  map={fabricTexture}
                  roughness={selectedFabric.roughness}
                  metalness={selectedFabric.metalness}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Vuelo peplum acampanado */}
              <mesh position={[0, -0.27, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.38, 0.18, 36, 1, true]} />
                <meshStandardMaterial
                  map={fabricTexture}
                  side={THREE.DoubleSide}
                  roughness={selectedFabric.roughness}
                />
              </mesh>
            </group>
          )}

          {design.cut === 'imperio' && (
            <group position={[0, 1.35, 0]}>
              <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.28, 0.23, 0.36, 36]} />
                <meshStandardMaterial
                  map={fabricTexture}
                  roughness={selectedFabric.roughness}
                  metalness={selectedFabric.metalness}
                />
              </mesh>
              {/* Cinta imperio dorada de satén */}
              <mesh position={[0, -0.09, 0]} castShadow>
                <cylinderGeometry args={[0.235, 0.235, 0.04, 36]} />
                <meshStandardMaterial color="#f6c344" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* ESCOTES */}
          {design.neckline === 'corazon' && (
            <mesh position={[0, 1.58, 0.11]} rotation={[0.42, 0, 0]} castShadow>
              <torusGeometry args={[0.13, 0.02, 16, 24, Math.PI * 0.85]} />
              <meshStandardMaterial color="#e8618c" roughness={0.4} />
            </mesh>
          )}
          {design.neckline === 'enV' && (
            <mesh position={[0, 1.56, 0.1]} rotation={[0.5, 0, 0]} castShadow>
              <coneGeometry args={[0.14, 0.2, 3]} />
              <meshStandardMaterial color="#2d3436" roughness={0.6} />
            </mesh>
          )}

          {/* FALDAS REALISTAS */}
          {design.skirtStyle === 'tubo' && (
            <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.21, 0.28, 0.78, 36, 1, true]} />
              <meshStandardMaterial
                map={fabricTexture}
                side={THREE.DoubleSide}
                roughness={selectedFabric.roughness}
                metalness={selectedFabric.metalness}
              />
            </mesh>
          )}

          {design.skirtStyle === 'evase' && (
            <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.68, 0.98, 36, 1, true]} />
              <meshStandardMaterial
                map={fabricTexture}
                side={THREE.DoubleSide}
                roughness={selectedFabric.roughness}
                metalness={selectedFabric.metalness}
              />
            </mesh>
          )}

          {design.skirtStyle === 'plisada' && (
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.21, 0.58, 0.94, 32, 1, true]} />
              <meshStandardMaterial
                map={fabricTexture}
                side={THREE.DoubleSide}
                roughness={selectedFabric.roughness}
                metalness={selectedFabric.metalness}
              />
            </mesh>
          )}

          {/* ACCESORIOS DECORATIVOS DE ALTA COSTURA */}
          {decorations.buttons && (
            <group position={[0, 1.35, 0.22]}>
              {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
                <mesh key={i} position={[0, y, 0]} castShadow>
                  <sphereGeometry args={[0.014, 16, 16]} />
                  <meshStandardMaterial color="#f1f2f6" metalness={0.7} roughness={0.2} />
                </mesh>
              ))}
            </group>
          )}

          {decorations.bow && (
            <group position={[0, 1.05, 0.21]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.04, 0.02]} />
                <meshStandardMaterial color="#e8618c" roughness={0.4} />
              </mesh>
              <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
                <coneGeometry args={[0.04, 0.08, 16]} />
                <meshStandardMaterial color="#e8618c" roughness={0.4} />
              </mesh>
              <mesh position={[0.05, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
                <coneGeometry args={[0.04, 0.08, 16]} />
                <meshStandardMaterial color="#e8618c" roughness={0.4} />
              </mesh>
            </group>
          )}

          {decorations.lace && (
            <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.66, 0.02, 16, 48]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
          )}

          {decorations.brooch && (
            <mesh position={[0, 1.62, 0.12]} castShadow>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshStandardMaterial color="#ffd32a" metalness={0.9} roughness={0.1} />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
};

export default Mannequin;
