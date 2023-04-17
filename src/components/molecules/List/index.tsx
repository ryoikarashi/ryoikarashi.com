import React from 'react';
import { TextList } from '@/components/molecules/List/TextList';

interface ListItem {
  label: string;
  url?: string;
}

export interface ListProps {
  items: ListItem[];
}

function List(props: ListProps): JSX.Element {
  return <TextList {...props} />;
}

List.TextList = TextList;

export default List;
