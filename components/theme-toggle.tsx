'use client';

import { useTheme } from '@/lib/theme-context';
import { themeToggleOptions, ThemeName } from '@/lib/themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="flex items-center gap-1 rounded-full border px-1 py-1 text-xs"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        color: 'var(--fg-muted)',
      }}
      aria-label="Theme toggle"
    >
      {themeToggleOptions.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name as ThemeName)}
          className="rounded-full px-2 py-1 transition-colors"
          style={{
            backgroundColor: theme === t.name ? 'var(--bg-tertiary)' : 'transparent',
            color: theme === t.name ? 'var(--fg)' : 'var(--fg-muted)',
          }}
          title={t.description}
          aria-pressed={theme === t.name}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
