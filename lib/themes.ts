export type ThemeName =
  | 'default'
  | 'minimal'
  | 'terminal'
  | 'neon'
  | 'modern'
  | 'hybrid-light'
  | 'hybrid-dark';

export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
}

export const themes: Theme[] = [
  {
    name: 'hybrid-light',
    label: 'Light',
    description: 'Hybrid light mode with banteg-inspired typography',
  },
  {
    name: 'hybrid-dark',
    label: 'Dark',
    description: 'Hybrid dark mode with banteg-inspired typography',
  },
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
  {
    name: 'modern',
    label: 'Modern',
    description: 'Inter + Source Serif, semantic text hierarchy',
  },
];

export const defaultTheme: ThemeName = 'hybrid-light';

export const themeToggleOptions = themes.filter(
  (theme) => theme.name === 'hybrid-light' || theme.name === 'hybrid-dark'
);
