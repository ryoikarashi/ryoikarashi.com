import React, { type JSX } from 'react';
import { type HTMLElementProps, Text } from '@/components/atoms';
import { twMerge } from 'tailwind-merge';

type PlaceholderProps = HTMLElementProps<HTMLDivElement>;

function Placeholder(props: PlaceholderProps): JSX.Element {
  return (
    <span
      {...props}
      className={twMerge(
        props.className,
        'block h-8 w-[380px] max-w-full animate-pulse bg-black/10 dark:bg-white/10'
      )}
    />
  );
}

function Loading(): JSX.Element {
  return (
    <Text>
      <span className="after:animate-dotsLight dark:after:animate-dotsDark text-black after:content-['.'] dark:text-white">
        Loading
      </span>
    </Text>
  );
}

Loading.Placeholder = Placeholder;

export default Loading;
