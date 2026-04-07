import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { projects as projectsData } from '../data/project';

export default function Projects() {
  const projects = useMemo(() => projectsData, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="relative space-y-24 py-20 px-4 md:px-0"
    >
      {/* Decorative Vertical Data Paths - Mobile Punch */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-celestial-primary/20 to-transparent hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-celestial-primary/20 to-transparent hidden md:block" />

      <div className="text-center space-y-4 mb-20 relative">
        {/* Tactical Corner Brackets */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-celestial-primary/30 rounded-tl-xl" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-celestial-primary/30 rounded-tr-xl" />
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs font-bold text-celestial-primary uppercase tracking-[0.5em] opacity-60"
        >
          Archive Registry // 2026
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter"
        >
          Selected <span className="text-celestial-primary text-glow">Works</span>
        </motion.h1>
      </div>

      <motion.div 
        className="grid md:grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {projects.map((p, i) => (
          <motion.div 
            key={p.title}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
          >
            {/* Project Metadata Label - Solid Tech Feel */}
            <div className="absolute -top-6 left-2 flex items-center space-x-2">
              <span className="text-[10px] font-mono text-celestial-primary/40 uppercase tracking-widest">
                DATA_PT: [{String(i + 1).padStart(2, '0')}]
              </span>
              <div className="w-12 h-[1px] bg-celestial-primary/20" />
            </div>
            
            <ProjectCard {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
