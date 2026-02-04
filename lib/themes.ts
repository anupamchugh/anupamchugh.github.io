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
    name: 'modern',
    label: 'Dark',
    description: 'Black modern with serif prose',
  },
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
    name: 'default',
    label: 'Default',
    description: 'Dark slate with sky accents',
  },
];

export const defaultTheme: ThemeName = 'modern';

export const themeToggleOptions = themes.filter(
  (theme) => theme.name === 'modern' || theme.name === 'hybrid-light'
);
