import { match } from 'ts-pattern';
import { PropsWithChildren } from 'react';
import { HTMLElementProps, Size } from '@/components/atoms';
import { Link } from '@/components/atoms';

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
}: PropsWithChildren<TextProps>) {
  const textClass = match(size)
    .with('sm', () => 'text-xs')
    .with('md', () => 'text-base')
    .with('lg', () => 'text-lg')
    .with(undefined, () => 'text-base')
    .exhaustive();

  return (
    <span {...rest} className={`${textClass} ${className ?? ''}`}>
      {link ? (
        <Link href={link} target='_blank'>
          {children}
        </Link>
      ) : (
        children
      )}
    </span>
  );
}
