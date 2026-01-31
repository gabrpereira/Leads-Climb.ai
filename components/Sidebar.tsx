
import React, { useState, useEffect } from 'react';
import { 
  Home,
  User, 
  Settings,
  Sun, 
  Moon,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-700/30 dark:border-indigo-800 flex flex-col items-center py-8 z-50 rounded-r-[40px] shadow-[10px_0_30px_rgba(79,70,229,0.3)] transition-colors duration-300">
      {/* Top Logo Area */}
      <div className="mb-12">
        <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden backdrop-blur-sm">
          <div className="text-[10px] text-white font-black leading-tight text-center uppercase tracking-tighter">Cl<br/>Im</div>
        </div>
      </div>

      {/* Main Actions Area - Compacta */}
      <div className="flex flex-col gap-6 items-center">
        {/* Home */}
        <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-indigo-600 transition-all shadow-lg hover:shadow-white/20 active:scale-90">
          <Home size={22} />
        </button>

        {/* Perfil */}
        <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-indigo-600 transition-all shadow-lg hover:shadow-white/20 active:scale-90">
          <User size={22} />
        </button>

        {/* Configurações */}
        <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-indigo-600 transition-all shadow-lg hover:shadow-white/20 active:scale-90">
          <Settings size={22} />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 ${
            isDark 
            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:shadow-yellow-400/10' 
            : 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400 hover:text-indigo-900 hover:shadow-yellow-400/20'
          }`}
        >
          {isDark ? <Moon size={22} fill="currentColor" /> : <Sun size={22} />}
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto pb-2">
        <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 transition-colors active:scale-90">
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
