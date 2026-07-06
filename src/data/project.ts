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
    tech: ['React', 'TypeScript', 'Supabase', 'Zustand', 'Recharts'],
    points: [
      'Engineered a full-stack dashboard featuring PostgreSQL integration via Supabase for secure data persistence.',
      'Architected a high-performance state management system using Zustand with IndexedDB for offline-first capabilities.',
      'Developed data visualizations using Recharts, including 30-day balance trends and automated anomaly detection.',
      'Implemented UX features including fuzzy search (Fuse.js), role-based access, and a responsive grid system.',
    ],
    github: 'https://github.com/veha2309/FinanceFlow',
    live: 'https://finance-flow-pi-eight.vercel.app/',
    accentColor: '#3b82f6',
    showDemo: true,
  },
  {
    title: 'Uber Clone Application',
    description: 'A cross-platform ride-hailing mobile application clone featuring local database support and real-time backend integration.',
    tech: ['Flutter', 'Hive', 'Firebase'],
    points: [
      'Developing a cross-platform ride-hailing mobile application clone utilizing Flutter.',
      'Implementing Hive for efficient local data storage and fast data retrieval.',
    ],
    github: 'https://github.com/veha2309?tab=repositories',
    live: '#',
    accentColor: '#8b5cf6',
  },
  {
    title: 'Microplastic Detection System (SIH)',
    description: 'A hardware-software hybrid system for real-time microplastic detection in water samples, developed for Smart India Hackathon.',
    tech: ['Flutter', 'Next.js', 'IoT'],
    points: [
      'Contributed to a hardware-based system for detecting microplastics in water samples under Smart India Hackathon.',
      'Developed a Flutter mobile application and a Next.js web dashboard for real-time sensor monitoring.',
    ],
    github: 'https://github.com/veha2309/PlastiSense-Flutter/tree/master',
    live: '#',
    accentColor: '#10b981',
  },
  {
    title: 'Real-Time Chat Application',
    description: 'A professional communication platform featuring real-time messaging, group channels, and JWT-based security.',
    tech: ['React.js', 'Node.js', 'Socket.io', 'Tailwind CSS'],
    points: [
      'Built a real-time chat application with one-to-one and group messaging using WebSockets.',
      'Designed a responsive UI using Tailwind CSS and implemented JWT-based authentication.',
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
      'Built a dedicated stock monitoring application with real-time portfolio tracking and profit/loss calculation.',
      'Architected a high-fidelity dashboard using Next.js and TypeScript for scalable, type-safe development.',
      'Integrated Supabase for real-time data streaming and secure PostgreSQL database management.',
      'Developed a premium glassmorphic UI with tactical HUD elements and 60FPS micro-animations.',
    ],
    github: 'https://github.com/veha2309/StockPulse',
    live: 'https://stockpulse-nine-taupe.vercel.app/',
    accentColor: '#00e5ff',
    showDemo: true,
  },
  {
    title: 'StockPulse — Mobile Trading Terminal',
    description: 'A professional-grade Flutter application for real-time stock and options trading. Features high-precision interactive charting, granular risk management, and live synchronization.',
    tech: ['Flutter', 'Provider', 'Supabase', 'Hive', 'Yahoo Finance API'],
    points: [
      'Engineered a custom-painted candlestick chart with high-precision touch and crosshair tracking optimized for mobile screens.',
      'Implemented granular risk management allowing unique Stop Loss and Take Profit levels per holding with FIFO selling logic.',
      'Integrated Supabase Realtime synchronization to seamlessly connect trades between the web platform and the mobile application.',
      'Developed a premium Glassmorphic UI supporting both Light and Dark theme modes with custom animations.',
    ],
    github: 'https://github.com/veha2309/StockPulseMobile-',
    live: 'https://drive.google.com/file/d/17P-hwh96zL_B4n5JirdpTMmvKNQHCI9d/view?usp=drive_link',
    accentColor: '#0284c7',
    showDemo: true,
  },
];
