export interface NavItem {
  name: string;
  path: string;
}

export const navigation: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Resume', path: '/resume' },
];
