'use client';

import React from 'react';
import { type HTMLElementProps, Button } from '@/components/atoms';
import { useThemeToggler } from '@/hooks';

export type ThemeSwitcherProps = HTMLElementProps<HTMLButtonElement>;

export function ThemeSwitcher(props: ThemeSwitcherProps): JSX.Element {
  const [, toggleTheme] = useThemeToggler();
  return (
    <Button.SimpleCircle
      {...props}
      onClick={() => {
        toggleTheme();
      }}
    />
  );
}
