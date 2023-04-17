import { Fragment } from 'react';
import { Divider, Size, Text } from '@/components/atoms';
import { ListProps } from '@/components/molecules/List/index';

export type TextListProps = ListProps & {
  size?: Size;
};

export function TextList({ items, size }: TextListProps) {
  return (
    <Fragment>
      {items.map((item, index) => {
        const textProps =
          !!item.url && !!item.url.length ? { link: item.url } : {};
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`text-list-${index}`}>
            <Text {...textProps} size={size}>
              {item.label}
            </Text>
            {isLast ? null : <Divider dividerString='/' gap='sm' />}
          </Fragment>
        );
      })}
    </Fragment>
  );
}
