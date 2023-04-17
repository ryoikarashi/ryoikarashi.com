import React, { Fragment } from 'react';
import { Divider, Text, type Size } from '@/components/atoms';
import { type ListProps } from '@/components/molecules/List/index';

export type TextListProps = ListProps & {
  size?: Size;
};

export function TextList({ items, size }: TextListProps): JSX.Element {
  return (
    <Fragment>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`text-list-${index}`}>
            <Text link={item.url} size={size}>
              {item.label}
            </Text>
            {isLast ? null : <Divider dividerString='/' gap='sm' />}
          </Fragment>
        );
      })}
    </Fragment>
  );
}
