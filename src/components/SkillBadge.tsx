import React from 'react';

interface SkillBadgeProps {
  text: string;
}

/**
 * Skill chip re-themed to match the celestial/glass HUD design language
 * used throughout the rest of the site (previously hardcoded slate colors
 * that didn't respond to light/dark theme switching).
 */
const SkillBadge: React.FC<SkillBadgeProps> = ({ text }) => (
  <span
    className="inline-flex items-center px-4 py-2 bg-celestial-primary/5 text-celestial-text/80
               rounded-lg border border-celestial-outline text-sm font-medium tracking-wide
               transition-all duration-300 hover:border-celestial-primary/50
               hover:bg-celestial-primary/10 hover:text-celestial-primary"
  >
    {text}
  </span>
);

export default React.memo(SkillBadge);
