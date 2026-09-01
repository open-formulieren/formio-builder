import type {Data} from '@dnd-kit/abstract';
import {SortableKeyboardPlugin} from '@dnd-kit/dom/sortable';
import {useSortable} from '@dnd-kit/react/sortable';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {clsx} from 'clsx';
import React from 'react';

import ComponentControls from './ComponentControls';
import './SortableItem.scss';
import {SortableItemContext, useDropzoneContext, useSortableItemContext} from './context';

export interface SortableItemData extends Data {
  component: AnyComponentSchema;
}

interface SortableItemProps extends React.PropsWithChildren {
  id: string;
  index: number;
  dropzoneId: string;
  component: AnyComponentSchema;
  hasControls?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  dropzoneId,
  component,
  hasControls = true,
  children,
}) => {
  const {collisionPriority} = useDropzoneContext();
  const {isDragging: isDraggingParent} = useSortableItemContext();
  const {ref, isDragging} = useSortable<SortableItemData>({
    id,
    index,
    group: dropzoneId,
    collisionPriority,
    disabled: isDraggingParent,
    data: {
      component,
    },
    plugins: [SortableKeyboardPlugin],
  });
  return (
    <SortableItemView
      ref={ref}
      testId={`sortable-item-${id}`}
      className={clsx('offb-dnd-sortable-item', {
        'offb-dnd-sortable-item--is-dragging': isDragging,
      })}
      component={component}
      showControls={hasControls && !isDragging}
    >
      <SortableItemContext.Provider value={{isDragging: isDragging || isDraggingParent}}>
        {children}
      </SortableItemContext.Provider>
    </SortableItemView>
  );
};

interface SortableItemViewProps extends React.PropsWithChildren {
  testId?: string;
  component: AnyComponentSchema;
  className?: string;
  showControls?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortableItemView = React.forwardRef<any, SortableItemViewProps>(
  ({testId, component, showControls = false, className, children}, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('offb-dnd-sortable-item-view', className)}
        data-testid={testId}
        id={`sortable-item-${component.id}`}
      >
        {showControls && <ComponentControls component={component} />}
        {children}
      </div>
    );
  }
);

SortableItemView.displayName = 'SortableItemView';

export {SortableItemView};
export default SortableItem;
