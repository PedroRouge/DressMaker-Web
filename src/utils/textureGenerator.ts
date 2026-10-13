// src/utils/textureGenerator.ts
import * as THREE from 'three';

/**
 * Generador de texturas de tela procedurales de alta resolución (Canvas 512x512)
 * Crea texturas repetibles hiperrealistas: Vichy, Floral, Lino con trama y Lunares.
 */
export function createFabricTexture(type: 'vichy' | 'floral' | 'linen' | 'polka' | 'damask', baseColor: string, secondaryColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  if (type === 'vichy') {
    // Cuadros Vichy tradicionales
    const size = 32;
    ctx.fillStyle = secondaryColor;
    for (let x = 0; x < 512; x += size * 2) {
      for (let y = 0; y < 512; y += size * 2) {
        ctx.fillRect(x, y, size, size);
        ctx.fillRect(x + size, y + size, size, size);
      }
    }
    // Tono semitransparente para intersección
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 0; x < 512; x += size) {
      for (let y = 0; y < 512; y += size) {
        if ((x / size + y / size) % 2 === 0) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  } else if (type === 'polka') {
    // Lunares clásicos estilo vintage
    const spacing = 48;
    const radius = 9;
    ctx.fillStyle = secondaryColor;
    for (let x = spacing / 2; x < 512; x += spacing) {
      for (let y = spacing / 2; y < 512; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + spacing / 2, y + spacing / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === 'floral') {
    // Estampado botánico floral romántico
    const count = 36;
    for (let i = 0; i < count; i++) {
      const cx = (i * 87) % 512;
      const cy = (i * 123) % 512;
      
      // Pétalos
      ctx.fillStyle = secondaryColor;
      for (let p = 0; p < 5; p++) {
        const angle = (p * Math.PI * 2) / 5;
        const px = cx + Math.cos(angle) * 10;
        const py = cy + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Centro de flor
      ctx.fillStyle = '#f6c344';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Hojita verde tenue
      ctx.fillStyle = 'rgba(76, 175, 80, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx + 14, cy - 8, 6, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'linen') {
    // Trama de hilo textil realista (urdimbre y trama)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 512; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 2; i < 512; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
  } else if (type === 'damask') {
    // Brocado / Damasco arabesco
    ctx.fillStyle = secondaryColor;
    for (let x = 32; x < 512; x += 64) {
      for (let y = 32; y < 512; y += 64) {
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.arc(x, y, 8, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillRect(x - 2, y - 24, 4, 48);
        ctx.fillRect(x - 24, y - 2, 48, 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
