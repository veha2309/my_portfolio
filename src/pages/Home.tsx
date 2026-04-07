import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center pt-40 space-y-16 px-4">
      {/* Hero Content */}
      <div className="text-center space-y-8 relative z-10 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="inline-block px-4 py-1.5 glass rounded-full border border-celestial-primary/30 text-celestial-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 glow-primary"
        >
          System Initialized // Vedant Shukla
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-celestial-text tracking-tighter"
        >
          Crafting <span className="text-celestial-primary text-glow">Spatial</span> <br />
          Experiences.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-celestial-text/60 font-light max-w-2xl mx-auto leading-relaxed"
        >
          CSE Student & Full-Stack Architect specializing in MERN, Next.js, and Flutter. 
          Turning complex assignments into high-performance digital infrastructure.
        </motion.p>
      </div>

      {/* About Section - Celestial HUD Style */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="glass rounded-[3rem] p-10 border border-celestial-outline max-w-3xl text-center relative z-10 overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-celestial-primary/50 to-transparent opacity-50" />
        
        <h2 className="text-sm font-bold text-celestial-primary uppercase tracking-[0.3em] mb-6">Core Directive</h2>
        <p className="text-celestial-text text-lg md:text-xl leading-relaxed mb-6 font-medium">
          I am a Computer Science Engineering student navigating the final semester of my third year. 
          I don't just study theory; I actively build architectures using the MERN stack, TypeScript, and Flutter. 
          I leverage AI-driven workflows to accelerate full-fledged software development with precision and speed.
        </p>
        
        <div className="flex justify-center space-x-6 pt-4">
          {[
            { icon: <Github size={20} />, href: "https://github.com/veha2309" },
            { icon: <Linkedin size={20} />, href: "https://linkedin.com/in/vedant-shukla-79a6342b1" },
            { icon: <Mail size={20} />, href: "mailto:engineerhai99@gmail.com" },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-celestial-primary/5 hover:bg-celestial-primary/20 text-celestial-text p-4 rounded-2xl transition-all border border-celestial-outline hover:border-celestial-primary/50"
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex flex-col items-center space-y-2 opacity-30 select-none"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-celestial-text">Initialize Scroll</span>
        <ArrowDown size={14} className="text-celestial-primary" />
      </motion.div>
    </section>
  );
}
