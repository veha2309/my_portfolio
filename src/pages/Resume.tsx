import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { experience as experienceData } from '../data/experience';
import { skills as skillsData } from '../data/skills';
import SkillBadge from '../components/SkillBadge';

export default function Resume() {
  const experience = useMemo(() => experienceData, []);
  const skills = useMemo(() => skillsData, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
  };

  return (
    <motion.section
      className="space-y-12"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
        variants={itemVariants}
      >
        Resume
      </motion.h1>

      {/* Experience */}
      <motion.div
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Experience</h2>
        <div className="space-y-6">
          {experience.length === 0 ? (
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-white">No Experience Yet</h3>
            </div>
          ) : (
            experience.map((job) => (
              <motion.div
                key={job.role}
                className="border-l-4 border-blue-500 pl-6"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold text-white">{job.role}</h3>
                <p className="text-blue-400 mb-2">
                  {job.company} | {job.period}
                </p>
                <ul className="space-y-2 text-slate-300">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Skills</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([cat, items]) => (
            <motion.div key={cat} variants={itemVariants}>
              <h3 className="text-xl font-bold text-blue-400 mb-3">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                  >
                    <SkillBadge text={s} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Education</h2>
        <div className="border-l-4 border-purple-500 pl-6">
          <h3 className="text-xl font-bold text-white">
            Bachelor of Technology in Computer Science Engineering
          </h3>
          <p className="text-purple-400">
            Dr. Akhilesh Das Gupta Institute of Professional Studies | 2023 - 2027
          </p>
          <p className="text-purple-300 font-light text-[12px]">
            Current GPA : 7.814
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}
