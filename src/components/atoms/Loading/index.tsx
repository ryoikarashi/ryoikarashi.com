import { HTMLElementProps, Text } from '@/components/atoms';

type PlaceholderProps = HTMLElementProps<HTMLDivElement>;

function Placeholder(props: PlaceholderProps) {
  return (
    <span
      {...props}
      className={`block h-5 w-[200px] animate-pulse bg-black/10 dark:bg-white/10 ${props.className}`}
    ></span>
  );
}

function Loading() {
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
