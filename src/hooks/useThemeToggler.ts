import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const useThemeToggler = (): [string, () => void] => {
  const [mode, setMode] = useState('dark');
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMode(resolvedTheme ?? 'dark');
  }, [resolvedTheme]);

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return [mode, toggleTheme];
};
