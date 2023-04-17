import { TextList } from '@/components/molecules/List/TextList';

type ListItem = {
  label: string;
  url?: string;
};

export type ListProps = {
  items: Array<ListItem>;
};

function List(props: ListProps) {
  return <TextList {...props} />;
}

List.TextList = TextList;

export default List;
