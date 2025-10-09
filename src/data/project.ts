export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
}

export const projects: Project[] = [
  {
    title: 'TalkSpace',
    description: "A real-time chat web application with user authentication, group chats, and media sharing.",
    tech: ['NextJS' , 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    link: 'https://talk-space-veha2309s-projects.vercel.app/',
  },
  {
    title: 'Task Management App',
    description:
      'Collaborative task management tool with real-time updates and team collaboration features.',
    tech: ['React', 'MongoDB', 'Tailwind CSS'],
    link: '#',
  },
  {
    title: 'Weather Dashboard',
    description: 'Interactive weather dashboard with data visualization and location-based forecasts.',
    tech: ['Flutter' , 'Dart', 'OpenWeather API' , 'Provider'],
    link: 'https://github.com/veha2309/WeatherApp/tree/master',
  },

];
