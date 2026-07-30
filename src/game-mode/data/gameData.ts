import { projects } from '../../data/project';
import { skills } from '../../data/skills';
import { experience } from '../../data/experience';
import type { GameMission } from '../gameMode.types';

const selectedProjects = projects.filter((project) => /FinanceFlow|StockPulse|Microplastic/i.test(project.title));

export const gameMissions: GameMission[] = selectedProjects.map((project, index) => ({
  id: `mission-${String(index + 1).padStart(2, '0')}`,
  title: project.title.split('—')[0].trim(),
  type: project.title.split('—')[1]?.trim() || 'ENGINEERING SYSTEM',
  objective: project.description,
  tech: project.tech,
  points: project.points || [],
  github: project.github,
  live: project.live === '#' ? undefined : project.live,
  state: /Mobile Trading/i.test(project.title) ? 'ACTIVE' : /Microplastic/i.test(project.title) ? 'EXPERIMENTAL' : 'COMPLETED',
}));

export const gameSkills = skills;
export const gameExperience = experience;

export const gameAchievements = [
  { title: 'FULL-STACK SYSTEM SHIPPED', detail: 'FinanceFlow validates secure persistence, state architecture, and production deployment.' },
  { title: 'REALTIME MARKET SYSTEM', detail: 'StockPulse connects portfolio tracking, live synchronization, and typed interface architecture.' },
  { title: 'MOBILE ENGINEERING', detail: 'Flutter work includes custom charting, local persistence, and cross-platform delivery.' },
  { title: 'COMPUTER VISION INTEGRATION', detail: 'Vision Assistant applies on-device inference to accessibility-focused environmental context.' },
  { title: 'HARDWARE / SOFTWARE RESEARCH', detail: 'PlastiSense joins sensor-oriented research with mobile and web monitoring interfaces.' },
];

export const gameProfile = {
  name: 'VEDANT SHUKLA',
  role: 'FULL-STACK DEVELOPER',
  specialization: 'WEB / MOBILE / AI SYSTEMS',
  location: 'DELHI, INDIA',
  status: 'ONLINE / BUILDING',
};
