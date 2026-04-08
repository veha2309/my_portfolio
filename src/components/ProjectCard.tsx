import React, { useState } from 'react';
import { ExternalLink, Github, ChevronRight, Star } from 'lucide-react';
import type { Project } from '../data/project';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import RatingModal, { RatingDisplay } from './RatingModal';

const ProjectCard: React.FC<Project> = ({ title, description, tech, github, live, points, accentColor, showDemo = false }) => {
  const [ratingOpen, setRatingOpen] = useState(false);
  const storageKey = `rating-project-${title.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { damping: 30, stiffness: 200 });
  const mouseYSpring = useSpring(y, { damping: 30, stiffness: 200 });

  // Refraction Glow Parallax
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--card-bg)] rounded-3xl p-8 border border-celestial-outline hover:border-celestial-primary/40 transition-all group relative overflow-hidden will-change-transform shadow-2xl"
    >
      {/* High-Performance 'Refraction Glow' Layer */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-celestial-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none"
        style={{
          left: glowX,
          top: glowY,
        }}
      />

      {/* Surface Scan Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-celestial-outline/20 to-transparent pointer-events-none" />

      {/* Tactical Laser Scan Animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-celestial-primary/10 to-transparent h-20 w-full z-20 pointer-events-none"
        initial={{ top: "-20%" }}
        whileHover={{ top: "100%" }}
        transition={{ duration : 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Decorative Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-celestial-primary/20 m-4 rounded-tl-lg group-hover:border-celestial-primary/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-celestial-primary/20 m-4 rounded-br-lg group-hover:border-celestial-primary/50 transition-colors" />

      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full shadow-2xl"
        style={{ backgroundColor: accentColor || 'var(--primary)' }}
      />
      
      <div className="relative z-10 space-y-6">
        <header className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-1 h-6 rounded-full opacity-80"
                style={{ backgroundColor: accentColor || 'var(--primary)' }}
              />
              <span className="hud-text text-[10px] text-celestial-text/40 tracking-[0.3em]">
                MOD: {title.slice(0, 3).toUpperCase()}-{Math.floor(Math.random() * 900) + 100}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-celestial-text tracking-tight group-hover:text-celestial-primary transition-colors">
              {title}
            </h3>
          </div>
          
          <div className="flex space-x-1">
             <div className="w-1 h-1 bg-celestial-primary rounded-full animate-ping" />
             <div className="w-1 h-1 bg-celestial-primary/20 rounded-full" />
             <div className="w-1 h-1 bg-celestial-primary/20 rounded-full" />
          </div>
        </header>

        <p className="text-celestial-text/70 text-lg leading-relaxed font-light">
          {description}
        </p>

        {points && points.length > 0 && (
          <ul className="space-y-3 bg-celestial-text/5 p-4 rounded-2xl border border-celestial-outline/20">
            {points.map((p, i) => (
              <li key={i} className="flex items-start text-xs text-celestial-text/80">
                <ChevronRight size={14} className="text-celestial-primary mr-2 mt-0.5 shrink-0" />
                <span className="leading-tight">{p}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-celestial-primary/5 text-celestial-primary rounded-sm text-[10px] font-bold tracking-widest border border-celestial-primary/10 hover:bg-celestial-primary/20 transition-colors uppercase"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <RatingDisplay storageKey={storageKey} />
        </div>

        <footer className="pt-6 flex items-center space-x-6 border-t border-celestial-outline">
          {live && showDemo && (
            <a
              href={live}
              className="inline-flex items-center text-celestial-primary hover:text-celestial-text transition-all font-bold tracking-widest uppercase text-[10px]"
              target="_blank"
              rel="noreferrer"
            >
              Initialize Demo <ExternalLink size={14} className="ml-2" />
            </a>
          )}
          {github && (
            <a
              href={github}
              className="inline-flex items-center text-celestial-text/60 hover:text-celestial-text transition-all font-bold tracking-widest uppercase text-[10px]"
              target="_blank"
              rel="noreferrer"
            >
              Repository <Github size={14} className="ml-2" />
            </a>
          )}
          <button
            onClick={() => setRatingOpen(true)}
            className="ml-auto inline-flex items-center text-celestial-text/40 hover:text-celestial-primary transition-all font-bold tracking-widest uppercase text-[10px]"
          >
            Rate <Star size={12} className="ml-1" />
          </button>
        </footer>

        <RatingModal
          isOpen={ratingOpen}
          onClose={() => setRatingOpen(false)}
          storageKey={storageKey}
          title={title}
        />
      </div>
    </motion.article>
  );
};

export default React.memo(ProjectCard);
