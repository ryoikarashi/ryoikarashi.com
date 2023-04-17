"use client";

import { HTMLElementProps, Button } from "@/components/atoms";
import { useThemeToggler } from "@/hooks";

export type ThemeSwitcherProps = HTMLElementProps<HTMLButtonElement>;

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const [_, toggleTheme] = useThemeToggler();
  return <Button.SimpleCircle {...props} onClick={(e) => toggleTheme()} />;
}
