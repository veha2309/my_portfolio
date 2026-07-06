export interface Experience {
  role: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export const experience: Experience[] = [
  {
    role: 'Web Developer Intern',
    company: 'IWayPlus',
    period: 'April – Present',
    responsibilities: [
      'Developed and optimized interactive web features using React.js and Next.js, enhancing overall user experience and interface responsiveness.',
      'Collaborated closely with the technical team to integrate RESTful APIs and ensure seamless communication between the front-end and back-end.',
      'Collaborated closely with the technical team to integrate front-end and back-end for National Zoo app and other flutter projects as well.',
    ],
  },
  {
    role: 'Flutter Developer Intern',
    company: 'AVS Seva Technologies',
    period: 'Dec 2025 – Jan 2026',
    responsibilities: [
      'Developed cross-platform mobile applications using Flutter and Dart.',
      'Collaborated with the design team to implement responsive UI components.',
    ],
  },
  {
    role: 'Mobile & Web Application Developer',
    company: 'Freelance Developer',
    period: 'Remote, India',
    responsibilities: [
      'Delivered custom mobile applications for freelance clients utilizing Flutter.',
      'Optimized application performance and managed end-to-end deployment.',
    ],
  },
];
