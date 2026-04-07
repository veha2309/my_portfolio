export interface Experience {
  role: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export const experience: Experience[] = [
  {
    role: 'Flutter Developer Intern',
    company: 'AVS Seva Technologies',
    period: 'Remote',
    responsibilities: [
      'Developed cross-platform mobile applications using Flutter and Dart',
      'Collaborated with the design team to implement responsive UI components',
    ],
  },
  {
    role: 'Mobile & Web Developer',
    company: 'Freelance',
    period: 'Delhi, India',
    responsibilities: [
      'Delivered custom mobile applications for freelance clients utilizing Flutter',
      'Optimized application performance and managed end-to-end deployment',
    ],
  },
];
