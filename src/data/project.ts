export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  points?: string[];
  accentColor?: string;
  showDemo?: boolean;
}

export const projects: Project[] = [
  {
    title: 'FinanceFlow — Personal Finance Dashboard',
    description: 'A full-stack personal finance dashboard featuring secure authentication, automated spending analysis, and high-performance state management.',
    tech: ['React 19', 'TypeScript', 'Supabase', 'Zustand', 'Tailwind v4', 'Recharts'],
    points: [
      'Engineered a full-stack dashboard featuring PostgreSQL integration via Supabase for secure user authentication and cloud data persistence',
      'Architected a high-performance state management system using Zustand with a normalized data structure (O(1) mutations) and IndexedDB for offline-first persistence',
      'Developed complex data visualizations using Recharts, including 30-day balance trends and category breakdowns with automated anomaly detection logic',
      'Implemented advanced UX features including fuzzy search (Fuse.js), role-based access control, and a fully responsive grid-based transaction system',
    ],
    github: 'https://github.com/veha2309/FinanceFlow',
    live: 'https://finance-flow-pi-eight.vercel.app/',
    accentColor: '#3b82f6',
    showDemo: true,
  },
  {
    title: 'Mobile Ecosystems — Multi-Architecture Builds',
    description: 'Complex mobile applications including an Uber clone and a parental control proof-of-concept utilizing Dart and Hive.',
    tech: ['Flutter', 'Dart', 'Hive', 'Firebase', 'Google Maps API'],
    points: [
      'Developed a high-performance Uber clone featuring real-time ride matchmaking and dynamic route handling via Google Maps',
      'Engineered a parental control proof-of-concept with local-first security using Hive for efficient, encrypted data storage',
      'Integrated Firebase for real-time lifecycle management, push notifications, and secure user authentication',
      'Optimized state management using Riverpod/Provider to ensure fluid 60FPS UI interactions on both platform ecosystems',
    ],
    github: 'https://github.com/veha2309?tab=repositories',
    live: '#',
    accentColor: '#8b5cf6',
  },
  {
    title: 'Microplastic Detection System (SIH)',
    description: 'A hardware-software hybrid system for real-time microplastic detection in water samples, developed for Smart India Hackathon.',
    tech: ['Flutter', 'Next.js', 'IoT', 'Tailwind CSS'],
    points: [
      'Contributed to a hardware-based system for detecting microplastics in water samples under Smart India Hackathon',
      'Developed a Flutter mobile application to display real-time sensor readings and analysis results',
      'Built a Next.js web dashboard for monitoring, visualization, and historical data analysis',
    ],
    github: 'https://github.com/veha2309/PlastiSense-Flutter/tree/master',
    live: '#',
    accentColor: '#10b981',
  },
  {
    title: 'TalkSpace — Real-time Chat App',
    description: 'A professional communication platform featuring real-time messaging, group channels, and JWT-based security.',
    tech: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
    points: [
      'Built a real-time chat application with one-to-one and group messaging using WebSockets',
      'Designed a responsive UI using Tailwind CSS and implemented JWT-based authentication',
      'Optimized bidirectional communication for seamless user interaction',
    ],
    github: 'https://github.com/veha2309/TalkSpace',
    live: 'https://talk-space-veha2309s-projects.vercel.app/',
    accentColor: '#f43f5e',
    showDemo: true,
  },
  {
    title: 'StockPulse — Dedicated Market Architecture',
    description: 'A high-performance stock monitoring and trading simulation platform with real-time portfolio tracking.',
    tech: ['Next.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'TypeScript'],
    points: [
      'Built a dedicated stock monitoring application with real-time portfolio tracking and profit/loss calculation',
      'Architected a high-fidelity dashboard using Next.js and TypeScript for scalable, type-safe development',
      'Integrated Supabase for real-time data streaming and secure PostgreSQL database management',
      'Developed a premium glassmorphic UI with tactical HUD elements and 60FPS micro-animations',
    ],
    github: 'https://github.com/veha2309/StockPulse',
    live: 'https://stockpulse-nine-taupe.vercel.app/',
    accentColor: '#00e5ff',
    showDemo: true,
  },
];
