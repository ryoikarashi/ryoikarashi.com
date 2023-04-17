import { ButtonProps } from '@/components/atoms/Button/index';

export type SimpleCircleButtonProps = ButtonProps;

export function SimpleCircleButton(props: SimpleCircleButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} after:hover:bg-black" p-6 outline-none after:block after:h-[10px] after:w-[10px] after:rounded-full after:border after:border-black after:bg-white after:duration-200 hover:after:bg-black after:dark:border-white after:dark:bg-black hover:after:dark:bg-white`}
    ></button>
  );
}
