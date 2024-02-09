import React, { type PropsWithChildren } from 'react';
import { match } from 'ts-pattern';
import { type HTMLElementProps, type Size, Link } from '@/components/atoms';

export type TextProps = HTMLElementProps<HTMLSpanElement> & {
  size?: Size;
  link?: string;
};

export function Text({
  children,
  size,
  link,
  className,
  ...rest
}: PropsWithChildren<TextProps>): JSX.Element {
  const textClass = match(size)
    .with('xs', () => 'text-xs')
    .with('sm', () => 'text-sm')
    .with('md', () => 'text-base')
    .with('lg', () => 'text-lg')
    .with(undefined, () => 'text-base')
    .exhaustive();

  const hasLink = link !== undefined;

  return (
    <span {...rest} className={`${textClass} ${className ?? ''}`}>
      {hasLink ? (
        <Link href={link} target='_blank'>
          {children}
        </Link>
      ) : (
        children
      )}
    </span>
  );
}
