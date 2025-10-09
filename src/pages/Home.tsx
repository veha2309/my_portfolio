"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center space-y-12 bg-gradient-to-br from-slate-900 to-slate-800 px-4 overflow-hidden">
      {/* Decorative Background Image - Left Side */}
      <motion.img
        src="/images/myself.png" // 👈 replace this
        alt="Vedant Shukla"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: -140, opacity: 0.25 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute max-md:hidden min-md:block left-0 bottom-0 md:bottom-auto md:top-1/2 transform md:-translate-y-1/2 w-[300px] md:w-[500px] lg:w-[500px] object-contain pointer-events-none select-none"
      />

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg relative z-10"
      >
        VS
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="text-center space-y-4 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Vedant Shukla
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300">
          Flutter Developer & Creative Problem Solver
        </p>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-2xl text-center relative z-10"
      >
        <h2 className="text-3xl font-bold text-white mb-4">About Me</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-3">
          My name is Vedant Shukla, and I am a dedicated software engineer with expertise in both Flutter development and full-stack web development. I specialize in building scalable, high-performance applications that deliver seamless user experiences across platforms. My technical proficiency spans front-end and back-end technologies, enabling me to craft solutions that are both robust and visually engaging.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          I take pride in my problem-solving abilities, which allow me to approach challenges with clarity, creativity, and precision. Whether I’m architecting mobile apps or developing complex web systems, I strive to deliver work that is thoughtful, efficient, and impactful.
        </p>
      </motion.div>

      {/* Social Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex justify-center space-x-6 relative z-10"
      >
        {[
          { icon: <Github size={24} />, href: "https://github.com/veha2309" },
          { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/vedant-shukla-79a6342b1/" },
          { icon: <Mail size={24} />, href: "mailto:engineerhai99@gmail.com" },
        ].map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            whileHover={{ scale: 1.2, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "keyframes", duration: 0.15 }}
            className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full transition"
          >
            {item.icon}
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
