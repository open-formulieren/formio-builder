import {useDroppable} from '@dnd-kit/react';

import {collisionDetection} from '@/components/designer/dragDrop/collisionDetection';

import './DropZone.scss';
import {DropzoneContext, useDropzoneContext, useSortableItemContext} from './context';

export interface DropZoneProps {
  id: string;
  children: React.ReactNode;
}

/**
 * A drag-and-drop container for components.
 */
const DropZone: React.FC<DropZoneProps> = ({id, children}) => {
  const {collisionPriority} = useDropzoneContext();
  const {isDragging} = useSortableItemContext();
  const {ref} = useDroppable({
    id,
    collisionPriority: collisionPriority,
    collisionDetector: collisionDetection,
    disabled: isDragging,
  });

  return (
    <div className="offb-drop-zone" data-testid={id} ref={ref}>
      <DropzoneContext.Provider value={{collisionPriority: collisionPriority + 1}}>
        {children}
      </DropzoneContext.Provider>
    </div>
  );
};

export default DropZone;
