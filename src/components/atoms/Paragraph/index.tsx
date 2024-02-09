import React, { type PropsWithChildren } from 'react';
import { match } from 'ts-pattern';
import type { HTMLElementProps, None, Size } from '@/components/atoms';

type ParagraphProps = HTMLElementProps<HTMLParagraphElement> & {
  gap?: Size | None;
};

export function Paragraph({
  children,
  gap,
  className,
  ...rest
}: PropsWithChildren<ParagraphProps>): JSX.Element {
  const gapClass = match(gap)
    .with('xs', () => 'mt-1')
    .with('sm', () => 'mt-2')
    .with('md', () => 'mt-5')
    .with('lg', () => 'mt-10')
    .with('none', () => 'mt-0')
    .with(undefined, () => 'mt-5')
    .exhaustive();

  return (
    <div {...rest} className={`${gapClass} ${className ?? ''}`}>
      {children}
    </div>
  );
}
