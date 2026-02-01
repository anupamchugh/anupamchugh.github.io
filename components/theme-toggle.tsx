'use client';

import { useTheme } from '@/lib/theme-context';
import { themes, ThemeName } from '@/lib/themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-800/50 p-1 text-xs">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`rounded-full px-2 py-1 transition-colors ${
            theme === t.name
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={t.description}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
