import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white font-black text-lg">
            👗
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              DressMaker Web
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">3D Fashion Atelier & Custom Studio</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <a
            href="https://dressmakergame.art/es/play"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/30 hover:bg-pink-500/20 transition-colors"
          >
            Inspiración Oficial
          </a>
          <a
            href="https://github.com/PedroRouge/DressMaker-Web"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
