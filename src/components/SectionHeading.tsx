import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  /** Small uppercase HUD label above the title, e.g. "Archive Registry // 2026" */
  eyebrow: string;
  /** Main heading text */
  title: string;
  /** Portion of the title to render in the primary glow color, e.g. "Works" in "Selected Works" */
  highlight?: string;
  /** Center or left align. Defaults to center. */
  align?: 'center' | 'left';
  /** Show decorative tactical corner brackets. Defaults to true. */
  brackets?: boolean;
  className?: string;
}

/**
 * Shared section heading used across Home, Projects, and Resume so that
 * eyebrow/title spacing, sizing, and animation stay perfectly consistent
 * throughout the site.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  align = 'center',
  brackets = true,
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  // Split the title so the `highlight` portion (if present) renders with the glow treatment.
  const renderTitle = () => {
    if (!highlight) return title;
    const idx = title.indexOf(highlight);
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const after = title.slice(idx + highlight.length);
    return (
      <>
        {before}
        <span className="text-celestial-primary text-glow">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <div className={`relative flex flex-col space-y-4 ${alignClass} ${className}`}>
      {brackets && (
        <>
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-celestial-primary/30 rounded-tl-xl" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-celestial-primary/30 rounded-tr-xl" />
        </>
      )}

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="hud-text text-xs font-bold text-celestial-primary uppercase tracking-[0.5em] opacity-60"
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="text-5xl md:text-7xl font-bold tracking-tighter text-celestial-text"
      >
        {renderTitle()}
      </motion.h1>
    </div>
  );
};

export default React.memo(SectionHeading);
