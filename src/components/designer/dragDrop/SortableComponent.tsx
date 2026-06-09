import type {Data} from '@dnd-kit/abstract';
import {useSortable} from '@dnd-kit/react/sortable';
import type {AnyComponentSchema} from '@open-formulieren/types';

import {useDropzoneContext} from './context';

export interface SortableItemData extends Data {
  component: AnyComponentSchema;
}

interface SortableItemProps extends React.PropsWithChildren {
  id: string;
  index: number;
  groupName: string;
  component: AnyComponentSchema;
}

const SortableItem: React.FC<SortableItemProps> = ({id, index, groupName, component, children}) => {
  const {collisionPriority} = useDropzoneContext();
  const {ref} = useSortable<SortableItemData>({
    id,
    index,
    group: groupName,
    collisionPriority,
    data: {
      component,
    },
  });
  return <div ref={ref}>{children}</div>;
};

export default SortableItem;
