import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSceneStore } from '../store/useSceneStore';
const items = [['home', 'ABOUT'], ['projects', 'WORK'], ['resume', 'DOSSIER'], ['contact', 'CONTACT']];
export default function Navbar() {
  const [active, setActive] = useState('home'); const [open, setOpen] = useState(false); const { navigationMode } = useSceneStore();
  useEffect(() => { const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)), { threshold: .35 }); document.querySelectorAll('section[id], footer[id]').forEach(e => observer.observe(e)); return () => observer.disconnect(); }, []);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); };
  return <nav className={`editorial-nav editorial-nav--${navigationMode}`}><div className="editorial-nav__line"><button className="wordmark" onClick={() => go('home')}>VEDANT SHUKLA</button><span className="nav-index">INDEX {String(items.findIndex(([id]) => id === active) + 1).padStart(2, '0')}/04</span><button className="nav-menu" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={18}/> : <Menu size={18}/>}</button></div><div className={`nav-links ${open ? 'nav-links--open' : ''}`}>{items.map(([id, label]) => <button key={id} className={active === id ? 'is-active' : ''} onClick={() => go(id)}>{label}</button>)}</div></nav>;
}
