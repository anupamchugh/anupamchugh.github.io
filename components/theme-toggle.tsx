'use client';

import { useTheme } from '@/lib/theme-context';
import { themeToggleOptions, ThemeName } from '@/lib/themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'modern';
  const iconLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
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
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'hybrid-light' : 'modern')}
        className="ml-1 flex h-7 w-7 items-center justify-center rounded-full transition-colors"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--fg-muted)',
        }}
        aria-label="Toggle theme"
        title={iconLabel}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M12 3.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM6.47 5.47a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L6.47 6.53a.75.75 0 0 1 0-1.06Zm11.06 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-8.5 4a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3.5 12Zm13.75-.75a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5ZM7.53 16.41a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm8.94 0 1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 1.06-1.06ZM12 18.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M21 14.5A8.5 8.5 0 0 1 9.5 3a.75.75 0 0 1 .98.92A7 7 0 1 0 20.08 13.5a.75.75 0 0 1 .92.98Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
