import type {Data} from '@dnd-kit/abstract';
import {useSortable} from '@dnd-kit/react/sortable';
import type {AnyComponentSchema} from '@open-formulieren/types';

import ComponentControls from './ComponentControls';
import './SortableComponent.scss';
import {useDropzoneContext} from './context';

export interface SortableItemData extends Data {
  component: AnyComponentSchema;
}

interface SortableItemProps extends React.PropsWithChildren {
  id: string;
  index: number;
  groupName: string;
  component: AnyComponentSchema;
  hasControls?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  groupName,
  component,
  hasControls = true,
  children,
}) => {
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
  return (
    <div ref={ref} className="offb-dnd-sortable-item" data-testid={`sortable-item-${id}`}>
      {hasControls && <ComponentControls component={component} />}
      {children}
    </div>
  );
};

export default SortableItem;
