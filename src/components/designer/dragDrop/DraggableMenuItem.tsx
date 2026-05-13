import {useDraggable} from '@dnd-kit/react';
import {AnyComponentSchema} from '@open-formulieren/types';
import {useId} from 'react';

interface DraggableMenuItemProps {
  type: AnyComponentSchema['type'];
}

const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({type}) => {
  const id = useId();

  const {ref} = useDraggable({
    id,
    data: {
      componentType: type,
      fromSidebar: true,
    },
  });

  return <div ref={ref}>ToolboxItem {type}</div>;
};

export default DraggableMenuItem;
