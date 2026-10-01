import { projects } from './project';
export const feedbackTargets = [
  { value: 'portfolio', label: 'Vedant Digital Studio' },
  { value: 'vedant', label: 'Working with Vedant' },
  ...projects.map(project => ({ value: project.slug, label: project.title })),
  { value: 'malamen', label: 'Malamen' },
  { value: 'signature-cafe', label: 'Signature Cafe' },
];
