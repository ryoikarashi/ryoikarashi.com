import React, {
  type AnchorHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { match } from 'ts-pattern';
import { twMerge } from 'tailwind-merge';

type NLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps & {
    children?: ReactNode;
  } & RefAttributes<HTMLAnchorElement> & { href: string };

export type LinkProps = NLinkProps & {
  noUnderline?: boolean;
};

export function Link({ noUnderline, ...props }: LinkProps): JSX.Element {
  const underlineClass = match(noUnderline)
    .with(true, () => 'border-b-0')
    .with(false, () => 'border-b')
    .with(undefined, () => 'border-b')
    .exhaustive();

  return (
    <NextLink
      {...props}
      className={twMerge(
        props.className,
        underlineClass,
        'border-dotted border-black p-1 duration-200 hover:bg-black hover:text-white dark:border-white hover:dark:bg-white hover:dark:text-black'
      )}
    />
  );
}
