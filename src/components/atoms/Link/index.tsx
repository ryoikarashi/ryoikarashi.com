import React, { AnchorHTMLAttributes, ReactNode, RefAttributes } from 'react';
import NextLink from 'next/link';
import { LinkProps as NextLinkProps } from 'next/link';
import { match } from 'ts-pattern';

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

export function Link({ noUnderline, ...props }: LinkProps) {
  const underlineClass = match(noUnderline)
    .with(true, () => 'border-b-0')
    .with(false, () => 'border-b')
    .with(undefined, () => 'border-b')
    .exhaustive();

  return (
    <NextLink
      {...props}
      className={`p-1 duration-200 ${underlineClass} border-dotted border-black hover:bg-black hover:text-white dark:border-white hover:dark:bg-white hover:dark:text-black ${props.className}`}
    />
  );
}
