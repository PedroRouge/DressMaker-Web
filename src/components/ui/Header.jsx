import React from 'react';

export default function Header() {
  return (
    <header className="bg-glass backdrop-blur-xs shadow-glass p-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold text-primary">
        <a href="/" className="hover:text-secondary transition-colors">
          DressMaker
        </a>
      </h1>
      <nav className="space-x-4">
        <a
          href="https://dressmakergame.art/es/play"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:text-secondary transition-colors"
        >
          Demo oficial
        </a>
        <a
          href="https://github.com/yourusername/dressmaker-web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:text-secondary transition-colors"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
