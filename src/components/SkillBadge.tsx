import React from 'react';

interface SkillBadgeProps {
  text: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ text }) => (
  <span className="inline-block px-4 py-2 bg-slate-700 text-slate-200 rounded-lg border border-slate-600 text-sm my-2">
    {text}
  </span>
);

export default React.memo(SkillBadge);
