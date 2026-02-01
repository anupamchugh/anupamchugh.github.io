export type ThemeName = 'default' | 'minimal' | 'terminal' | 'neon';

export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
}

export const themes: Theme[] = [
  {
    name: 'default',
    label: 'Default',
    description: 'Dark slate with sky accents',
  },
  {
    name: 'minimal',
    label: 'Minimal',
    description: 'HN-style clean typography',
  },
  {
    name: 'terminal',
    label: 'Terminal',
    description: 'Green-on-black hacker',
  },
  {
    name: 'neon',
    label: 'Neon',
    description: 'Cyberpunk glow',
  },
];

export const defaultTheme: ThemeName = 'default';
