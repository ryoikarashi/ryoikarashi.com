import { ReactElement } from "react";
import { HTMLElementProps, Text } from "@/components/atoms";

type PlaceholderProps = HTMLElementProps<HTMLDivElement> & {
  as?: ReactElement;
};

function Placeholder({ as, ...props }: PlaceholderProps) {
  return (
    <span
      {...props}
      className={`block animate-pulse h-5 bg-black/10 dark:bg-white/10 w-[200px] ${props.className}`}
    ></span>
  );
}

function Loading() {
  return (
    <Text>
      <span className="after:content-['.'] after:animate-dotsLight dark:after:animate-dotsDark text-black dark:text-white">
        Loading
      </span>
    </Text>
  );
}

Loading.Placeholder = Placeholder;

export default Loading;
