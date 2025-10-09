import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { projects as projectsData } from '../data/project';

export default function Projects() {
  const projects = useMemo(() => projectsData, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60 } },
  };

  return (
    <motion.section
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 👇 Heading now uses variants (no separate initial/animate) */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
        variants={headingVariants}
      >
        My Projects
      </motion.h1>

      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {projects.map((p) => (
          <motion.div key={p.title} variants={cardVariants}>
            <ProjectCard {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
