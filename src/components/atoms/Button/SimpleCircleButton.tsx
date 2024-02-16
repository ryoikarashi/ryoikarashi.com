import React from 'react';
import { type ButtonProps } from '@/components/atoms/Button/index';
import { twMerge } from 'tailwind-merge';

export type SimpleCircleButtonProps = ButtonProps;

export function SimpleCircleButton(
  props: SimpleCircleButtonProps
): JSX.Element {
  return (
    <button
      {...props}
      className={twMerge(
        props.className,
        'p-6 outline-none after:block after:h-[6px] after:w-[6px] after:rounded-full after:border after:border-black after:bg-white after:duration-200 hover:after:bg-black after:dark:border-white after:dark:bg-black hover:after:dark:bg-white'
      )}
    ></button>
  );
}
