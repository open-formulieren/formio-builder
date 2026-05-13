import type {Data} from '@dnd-kit/abstract';
import {useDraggable} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {useId} from 'react';

export interface DraggableMenuItemData extends Data {
  componentType: AnyComponentSchema['type'];
  fromSidebar: true;
}

interface DraggableMenuItemProps extends React.PropsWithChildren {
  type: AnyComponentSchema['type'];
}

const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({type, children}) => {
  const id = useId();

  const {ref} = useDraggable<DraggableMenuItemData>({
    id,
    data: {
      componentType: type,
      fromSidebar: true,
    },
  });

  return <div ref={ref}>{children}</div>;
};

export default DraggableMenuItem;
