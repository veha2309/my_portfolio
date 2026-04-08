import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Github, Linkedin, Mail } from 'lucide-react';
import RatingModal, { RatingDisplay } from './RatingModal';

export default function Footer() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  return (
    <footer className="relative mt-32 pb-12 space-y-16">
      {/* Top divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-celestial-primary/30 to-transparent" />

      {/* Dual Rating Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <p className="hud-text text-[10px] text-celestial-primary/60">Feedback Terminal // Open</p>
          <h3 className="text-3xl font-bold text-celestial-text tracking-tight">
            Leave Your <span className="text-celestial-primary text-glow">Assessment</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Portfolio Rating Card */}
          <div className="glass rounded-3xl p-8 border border-celestial-outline text-center space-y-4 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-celestial-primary/40 to-transparent" />
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-celestial-primary/30 m-3 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-celestial-primary/30 m-3 rounded-br-lg" />
            <p className="hud-text text-[10px] text-celestial-primary/60">Module // 01</p>
            <h4 className="text-xl font-bold text-celestial-text tracking-tight">Portfolio Experience</h4>
            <p className="text-celestial-text/40 text-xs leading-relaxed max-w-xs mx-auto">
              Rate the overall design, UI/UX, visual presentation, and how well this portfolio communicates the work.
            </p>
            <div className="flex justify-center pt-1">
              <RatingDisplay storageKey="rating-portfolio-design" />
            </div>
            <button
              onClick={() => setPortfolioOpen(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-celestial-primary/10 border border-celestial-primary/30 text-celestial-primary text-[10px] font-bold uppercase tracking-widest hover:bg-celestial-primary/20 transition-all"
            >
              Rate Portfolio <Star size={12} className="ml-2" />
            </button>
          </div>

          {/* Developer Skills Rating Card */}
          <div className="glass rounded-3xl p-8 border border-celestial-outline text-center space-y-4 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-celestial-primary/40 to-transparent" />
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-celestial-primary/30 m-3 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-celestial-primary/30 m-3 rounded-br-lg" />
            <p className="hud-text text-[10px] text-celestial-primary/60">Module // 02</p>
            <h4 className="text-xl font-bold text-celestial-text tracking-tight">Developer Skills</h4>
            <p className="text-celestial-text/40 text-xs leading-relaxed max-w-xs mx-auto">
              Rate Vedant's technical depth — code quality, architecture decisions, problem-solving, and stack expertise specifically.
            </p>
            <div className="flex justify-center pt-1">
              <RatingDisplay storageKey="rating-developer-skills" />
            </div>
            <button
              onClick={() => setSkillsOpen(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-celestial-primary/10 border border-celestial-primary/30 text-celestial-primary text-[10px] font-bold uppercase tracking-widest hover:bg-celestial-primary/20 transition-all"
            >
              Rate Skills <Star size={12} className="ml-2" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-celestial-outline/30">
        <p className="text-celestial-text/30 text-xs font-mono tracking-widest uppercase">
          © {new Date().getFullYear()} Vedant Shukla · Built with React + Three.js + TypeScript
        </p>
        <div className="flex items-center space-x-4">
          {[
            { icon: <Github size={16} />, href: 'https://github.com/veha2309' },
            { icon: <Linkedin size={16} />, href: 'https://linkedin.com/in/vedant-shukla-79a6342b1' },
            { icon: <Mail size={16} />, href: 'mailto:engineerhai99@gmail.com' },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noreferrer"
              className="text-celestial-text/30 hover:text-celestial-primary transition-colors">
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Modals — outside all overflow containers */}
      <RatingModal
        isOpen={portfolioOpen}
        onClose={() => setPortfolioOpen(false)}
        storageKey="rating-portfolio-design"
        title="Portfolio Experience"
      />
      <RatingModal
        isOpen={skillsOpen}
        onClose={() => setSkillsOpen(false)}
        storageKey="rating-developer-skills"
        title="Vedant's Developer Skills"
      />
    </footer>
  );
}
