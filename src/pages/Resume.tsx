import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { experience as experienceData } from '../data/experience';
import { skills as skillsData } from '../data/skills';
import SkillBadge from '../components/SkillBadge';
import { Briefcase, GraduationCap, Cpu } from 'lucide-react';

export default function Resume() {
  const experience = useMemo(() => experienceData, []);
  const skills = useMemo(() => skillsData, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <motion.section
      className="space-y-32 py-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        show: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <div className="text-center space-y-4 mb-20">
        <motion.h2 variants={itemVariants} className="text-sm font-bold text-celestial-primary uppercase tracking-[0.4em]">
          Technical Dossier
        </motion.h2>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-celestial-text tracking-tighter">
          Resume <span className="text-celestial-primary text-glow">& Experience</span>
        </motion.h1>
      </div>

      <div className="grid gap-16">
        {/* Experience Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex items-center space-x-4 border-b border-celestial-outline pb-4">
             <Briefcase className="text-celestial-primary" size={28} />
             <h2 className="text-3xl font-bold tracking-tight text-celestial-text">Experience</h2>
          </div>
          
          <div className="grid gap-12">
            {experience.length === 0 ? (
              <div className="glass p-8 rounded-3xl border border-celestial-outline text-center text-celestial-text/40 italic">
                Scanning for historical records... [Empty]
              </div>
            ) : (
              experience.map((job) => (
                <div key={job.role} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-celestial-primary before:to-transparent">
                  <h3 className="text-2xl font-bold text-celestial-text mb-2">{job.role}</h3>
                  <p className="text-celestial-primary font-medium mb-4 flex items-center">
                    {job.company} <span className="mx-3 opacity-20">|</span> <span className="text-celestial-text/50 font-normal">{job.period}</span>
                  </p>
                  <ul className="space-y-3 text-celestial-text/70 max-w-2xl">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-celestial-primary mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-celestial-primary shadow-[0_0_8px_var(--primary)]" />
                        <span className="text-celestial-text/80">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex items-center space-x-4 border-b border-celestial-outline pb-4">
             <Cpu className="text-celestial-primary" size={28} />
             <h2 className="text-3xl font-bold tracking-tight text-celestial-text">Tech Stack</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat} className="glass p-8 rounded-3xl border border-celestial-outline group hover:border-celestial-primary/30 transition-all">
                <h3 className="text-sm font-bold text-celestial-primary uppercase tracking-widest mb-6">{cat}</h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((s) => (
                    <SkillBadge key={s} text={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex items-center space-x-4 border-b border-celestial-outline pb-4">
             <GraduationCap className="text-celestial-primary" size={28} />
             <h2 className="text-3xl font-bold tracking-tight text-celestial-text">Education</h2>
          </div>
          
          <div className="glass p-10 rounded-3xl border border-celestial-outline relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-celestial-primary/5 blur-3xl rounded-full" />
            <h3 className="text-2xl font-bold text-celestial-text mb-2">
              Bachelor of Technology in Computer Science Engineering
            </h3>
            <p className="text-celestial-primary font-medium mb-4">
              Dr. Akhilesh Das Gupta Institute of Professional Studies <span className="mx-3 opacity-20">|</span> <span className="text-celestial-text/50 font-normal">2023 - 2027</span>
            </p>
            <div className="inline-flex flex-col space-y-2 px-4 py-3 bg-celestial-primary/10 rounded-xl border border-celestial-primary/20">
               <div className="flex items-center space-x-3">
                 <span className="text-xs uppercase tracking-widest text-celestial-text/40">Status:</span>
                 <span className="text-sm font-bold text-celestial-primary leading-none italic">Navigating Final Semester (3rd Year)</span>
               </div>
               <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase tracking-widest text-celestial-text/40">Current CGPA:</span>
                  <span className="text-sm font-bold text-celestial-text leading-none">7.814</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
    
  );
}
