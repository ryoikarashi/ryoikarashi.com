import React, { type JSX } from 'react';
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
        'p-6 outline-hidden after:block after:h-[6px] after:w-[6px] after:rounded-full after:border after:border-black after:bg-white after:duration-200 hover:after:bg-black dark:after:border-white dark:after:bg-black dark:hover:after:bg-white'
      )}
    />
  );
}
