import { Direction, HTMLElementProps, None, Size } from "@/components/atoms";
import { match } from "ts-pattern";

export type DividerProps = HTMLElementProps<HTMLSpanElement> & {
  gap?: Size | None;
  direction?: Direction;
  dividerString?: string;
};

export function Divider({
  gap,
  direction,
  dividerString,
  className,
  ...rest
}: DividerProps) {
  const gapClass = match([gap, direction])
    .with(["sm", "horizontal"], () => "mx-2")
    .with(["sm", "vertical"], () => "my-2")
    .with(["sm", undefined], () => "mx-2")
    .with(["md", "horizontal"], () => "mx-5")
    .with(["md", "vertical"], () => "my-5")
    .with(["md", undefined], () => "mx-5")
    .with(["lg", "horizontal"], () => "mx-10")
    .with(["lg", "vertical"], () => "my-10")
    .with(["lg", undefined], () => "mx-10")
    .with(["none", "horizontal"], () => "mx-0")
    .with(["none", "vertical"], () => "my-0")
    .with(["none", undefined], () => "mx-0")
    .with([undefined, "horizontal"], () => "mx-5")
    .with([undefined, "vertical"], () => "my-5")
    .with([undefined, undefined], () => "mx-5")
    .exhaustive();

  return (
    <span {...rest} className={`${gapClass} ${className ?? ""}`}>
      {dividerString}
    </span>
  );
}
