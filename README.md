# dressmaker-web

Juego 3D de diseño de ropa hecho con **React**, **Vite**, **Three.js**, **react-three-fiber**, **Zustand** y **Tailwind CSS**.

## 📦 Instalación

```bash
git clone https://github.com/PedroRouge/DressMaker-Web.git
cd dressmaker-web
npm install
npm run dev   # abre http://localhost:5173
```

## 🚀 Deploy en Vercel

1. Instala la CLI de Vercel (si no la tienes):
   ```bash
   npm i -g vercel
   ```
2. Ejecuta `vercel login` y sigue el proceso de autenticación en el navegador.
3. Dentro del proyecto, ejecuta:
   ```bash
   vercel
   ```
   La CLI detectará el archivo `vercel.json` y creará una URL de producción.
4. Cada vez que hagas `git push` a la rama **main**, Vercel redeployará automáticamente.

## 🗂 Estructura del proyecto

```
src/
  ├─ main.jsx               – punto de entrada
  ├─ App.jsx                – layout principal
  ├─ components/
  │   ├─ CanvasScene.jsx    – canvas Three.js
  │   ├─ scene/DressModel.jsx
  │   └─ ui/Header.jsx / Footer.jsx
  └─ store/useGameStore.js  – estado global con Zustand
public/
  └─ models/dress.glb        – modelo 3D (reemplázalo con tu propio GLB)
```

## 🎨 Estilos

Los estilos usan **Tailwind CSS** con un tema "glassmorphism" (colores, blur y sombras). Puedes personalizar `src/styles/index.css` para añadir más clases.
