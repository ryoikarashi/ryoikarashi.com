import React from 'react';
import { type HTMLElementProps, Text } from '@/components/atoms';
import { twMerge } from 'tailwind-merge';

type PlaceholderProps = HTMLElementProps<HTMLDivElement>;

function Placeholder(props: PlaceholderProps): JSX.Element {
  return (
    <span
      {...props}
      className={twMerge(
        props.className,
        'block h-7 w-[380px] max-w-full animate-pulse bg-black/10 dark:bg-white/10'
      )}
    ></span>
  );
}

function Loading(): JSX.Element {
  return (
    <Text>
      <span className="text-black after:animate-dotsLight after:content-['.'] dark:text-white dark:after:animate-dotsDark">
        Loading
      </span>
    </Text>
  );
}

Loading.Placeholder = Placeholder;

export default Loading;
