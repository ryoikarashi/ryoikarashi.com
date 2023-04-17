import { SimpleCircleButton } from '@/components/atoms/Button/SimpleCircleButton';
import { HTMLElementProps } from '@/components/atoms';

export type ButtonProps = HTMLElementProps<HTMLButtonElement> & {
  label?: string;
};

function Button(props: ButtonProps) {
  return (
    <button {...props} className={`${props.className} p-6 outline-none`}>
      {props.children}
    </button>
  );
}

Button.SimpleCircle = SimpleCircleButton;

export default Button;
