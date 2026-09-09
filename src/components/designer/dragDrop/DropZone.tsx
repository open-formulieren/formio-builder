import {useDragOperation, useDroppable} from '@dnd-kit/react';
import {clsx} from 'clsx';

import './DropZone.scss';
import {collisionDetection} from './collisionDetection';
import {DropzoneContext, useDropzoneContext, useSortableItemContext} from './context';
import {getTargetDropzoneId} from './utils/dragTarget';

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
  const {target} = useDragOperation();
  const {ref} = useDroppable({
    id,
    collisionPriority: collisionPriority + 1,
    collisionDetector: collisionDetection,
    disabled: isDragging,
  });

  const targetDropzone = getTargetDropzoneId(target);
  const isDragTarget = targetDropzone === id;

  return (
    <div
      className={clsx('offb-drop-zone', {
        'offb-drop-zone--drag-target': isDragTarget,
      })}
      data-testid={id}
      ref={ref}
    >
      <DropzoneContext.Provider value={{collisionPriority: collisionPriority + 2}}>
        {children}
      </DropzoneContext.Provider>
    </div>
  );
};

export default DropZone;
