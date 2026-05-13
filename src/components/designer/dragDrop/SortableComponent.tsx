import {useSortable} from '@dnd-kit/react/sortable';

interface SortableItemProps extends React.PropsWithChildren {
  id: string;
  index: number;
  groupName: string;
}

const SortableItem: React.FC<SortableItemProps> = ({id, index, groupName, children}) => {
  const {ref} = useSortable({
    id,
    index,
    group: groupName,
  });
  return <div ref={ref}>{children}</div>;
};

export default SortableItem;
