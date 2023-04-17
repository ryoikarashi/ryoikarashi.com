import { ButtonProps } from "@/components/atoms/Button/index";

export type SimpleCircleButtonProps = ButtonProps;

export function SimpleCircleButton(props: SimpleCircleButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} outline-none after:duration-200 after:block after:rounded-full after:border-black after:dark:border-white after:border p-6 after:w-[10px] after:h-[10px] after:bg-white hover:after:bg-black hover:after:dark:bg-white after:dark:bg-black after:hover:bg-black"`}
    ></button>
  );
}
