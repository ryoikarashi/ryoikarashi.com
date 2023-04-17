import { PropsWithChildren } from 'react';
import { match } from 'ts-pattern';
import { HTMLElementProps, None, Size } from '@/components/atoms';

type ParagraphProps = HTMLElementProps<HTMLParagraphElement> & {
  gap?: Size | None;
};

export function Paragraph({
  children,
  gap,
  className,
  ...rest
}: PropsWithChildren<ParagraphProps>) {
  const gapClass = match(gap)
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
