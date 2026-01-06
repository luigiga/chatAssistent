import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Escuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  return (
    <button
      onClick={cycleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      aria-label={`Tema: ${currentTheme.label}`}
      title={`Tema: ${currentTheme.label}`}
    >
      <CurrentIcon className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
    </button>
  );
}

