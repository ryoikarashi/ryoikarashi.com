import React from 'react';
import { twMerge } from 'tailwind-merge';
import { SimpleCircleButton } from '@/components/atoms/Button/SimpleCircleButton';
import { type HTMLElementProps } from '@/components/atoms';

export type ButtonProps = HTMLElementProps<HTMLButtonElement> & {
  label?: string;
};

function Button(props: ButtonProps): JSX.Element {
  return (
    <button {...props} className={twMerge(props.className, 'p-6 outline-none')}>
      {props.children}
    </button>
  );
}

Button.SimpleCircle = SimpleCircleButton;

export default Button;
