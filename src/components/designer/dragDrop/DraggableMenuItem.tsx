import type {Data} from '@dnd-kit/abstract';
import {useDraggable} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {useId} from 'react';

export interface DraggableMenuItemData extends Data {
  schema: AnyComponentSchema;
  fromSidebar: true;
}

interface DraggableMenuItemProps extends React.PropsWithChildren {
  schema: AnyComponentSchema;
}

const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({schema, children}) => {
  const id = useId();

  const {ref} = useDraggable<DraggableMenuItemData>({
    id,
    data: {
      componentType: schema.type,
      fromSidebar: true,
      schema,
    },
  });

  return <div ref={ref}>{children}</div>;
};

export default DraggableMenuItem;
