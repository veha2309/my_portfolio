import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navigation } from '../data/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition-all ${
      pathname === path ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Portfolio
          </div>

          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.name}
              </Link>
            ))}
          </div>

          <button onClick={() => setOpen((p) => !p)} className="md:hidden text-slate-300 hover:text-white">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 px-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)} className={linkClass(item.path)}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
