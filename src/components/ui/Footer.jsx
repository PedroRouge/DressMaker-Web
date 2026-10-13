export default function Footer() {
  return (
    <footer className="bg-glass backdrop-blur-xs shadow-glass p-2 text-center text-xs text-gray-300">
      © {new Date().getFullYear()} DressMaker – Todos los derechos reservados.
    </footer>
  );
}
