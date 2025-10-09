import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Project } from '../data/project';

const ProjectCard: React.FC<Project> = ({ title, description, tech, link }) => {
  return (
    <article className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all transform hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 mb-4">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
          >
            {t}
          </span>
        ))}
      </div>

      <a
        href={link}
        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        target="_blank"
        rel="noreferrer"
      >
        View Project <ExternalLink size={16} className="ml-2" />
      </a>
    </article>
  );
};

export default React.memo(ProjectCard);
