'use client';

import { useTheme } from '@/lib/theme-context';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (resolvedTheme === 'dark') {
      return '🌙'; // Moon for dark mode
    } else {
      return '☀️'; // Sun for light mode
    }
  };

  const getLabel = () => {
    if (theme === 'system') {
      return 'System';
    } else if (theme === 'light') {
      return 'Light';
    } else {
      return 'Dark';
    }
  };

  const getAriaLabel = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    return `Current theme: ${getLabel()}. Click to switch to ${nextTheme} mode.`;
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={getAriaLabel()}
    >
      <span className="text-lg" aria-hidden="true">{getIcon()}</span>
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
}