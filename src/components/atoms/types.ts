import { DetailedHTMLProps, HTMLAttributes } from 'react';

export type Size = 'sm' | 'md' | 'lg';
export type None = 'none';
export type Direction = 'horizontal' | 'vertical';
export type HTMLElementProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;
