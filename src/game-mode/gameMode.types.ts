export type GameScreen = 'home' | 'profile' | 'missions' | 'mission-detail' | 'skills' | 'experience' | 'achievements' | 'contact';

export type GameMission = {
  id: string;
  title: string;
  type: string;
  objective: string;
  tech: string[];
  points: string[];
  github?: string;
  live?: string;
  state: 'COMPLETED' | 'ACTIVE' | 'EXPERIMENTAL';
};
