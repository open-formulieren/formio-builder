import {useDroppable} from '@dnd-kit/react';

import './DropZone.scss';

export interface DropZoneProps {
  id: string;
  children: React.ReactNode;
}

/**
 * A drag-and-drop container for components.
 */
const DropZone: React.FC<DropZoneProps> = ({id, children}) => {
  const {ref} = useDroppable({id});

  return (
    <div className="offb-drop-zone" ref={ref}>
      {children}
    </div>
  );
};

export default DropZone;
