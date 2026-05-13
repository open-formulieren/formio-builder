import type {Draggable, Droppable} from '@dnd-kit/dom';
import {arrayMove} from '@dnd-kit/helpers';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/react';
import {DragDropProvider, DragOverlay} from '@dnd-kit/react';
import {isSortable} from '@dnd-kit/react/sortable';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {useRef} from 'react';
import {useImmer} from 'use-immer';

import {DraggableMenuItem, DropZone, SortableComponent} from './dragDrop';

const getData = (prop: Draggable | Droppable | null) => prop?.data ?? {};

const getTargetIndex = (target: Droppable | null) => (isSortable(target) ? target.index : -1);

export interface FormDesignerProps {
  components: AnyComponentSchema[];
}

const FormDesigner: React.FC<FormDesignerProps> = ({components}) => {
  const spacerInsertedRef = useRef<boolean>(false);
  const [items, setItems] = useImmer<{fields: string[]}>({
    fields: ['Item 1', 'Item 2', 'Item 3'],
  });

  const insertSpacer = (index: number) => {
    setItems(draft => {
      // If there are no fields, add a spacer to the first position.
      if (!draft.fields.length) {
        draft.fields.push('spacer');
        return;
      }

      // Place the spacer at the correct position.
      draft.fields.splice(index, 0, 'spacer');
    });
    spacerInsertedRef.current = true;
  };

  const moveSpacer = (index: number) => {
    setItems(draft => {
      const spacerIndex = draft.fields.findIndex(item => item === 'spacer');
      if (index === spacerIndex) {
        return;
      }

      draft.fields = arrayMove(draft.fields, spacerIndex, index);
    });
  };

  const removeSpacer = () => {
    setItems(draft => {
      draft.fields = draft.fields.filter(i => i !== 'spacer');
    });
    spacerInsertedRef.current = false;
  };

  const insertComponent = (type: AnyComponentSchema['type'], finalPosition: number) => {
    setItems(draft => {
      const spacerIndex = draft.fields.findIndex(item => item === 'spacer');
      draft.fields.splice(spacerIndex, 1, `${type} ${Date.now()}`);

      draft.fields = arrayMove(draft.fields, spacerIndex, finalPosition);
      spacerInsertedRef.current = false;
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);

    // When moving an existing item, just let dnd-kit handle it.
    if (!sourceData?.fromSidebar) return;

    // When moved outside the dropzone, remove the spacer.
    if (!target) {
      removeSpacer();
      return;
    }

    if (!spacerInsertedRef.current) {
      insertSpacer(getTargetIndex(target));
    } else {
      moveSpacer(getTargetIndex(target));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);

    // When moving an existing item, just let dnd-kit handle it.
    if (!sourceData?.fromSidebar) return;

    // Dropped the draggable outside the dropzone.
    if (!target) {
      removeSpacer();
      return;
    }

    // Replace the spacer with the new component.
    insertComponent(sourceData.componentType, getTargetIndex(target));
  };

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <DragOverlay disabled={source => !source?.data?.fromSidebar} dropAnimation={null}>
        <div>Draggable fo</div>
      </DragOverlay>

      <div className="row">
        <div className="col col-2">
          {/* @TODO replace with ComponentsList */}
          <DraggableMenuItem type="textfield" />
          <DraggableMenuItem type="select" />
        </div>
        <div className="col col-10">
          {/* @TODO replace with ComponentsPreview */}
          <DropZone id="main-dropzone">
            {items.fields.map((component, index) => (
              <SortableComponent
                key={component}
                id={component}
                index={index}
                groupName="main-dropzone"
              >
                <span
                  className="badge badge-pill badge-primary"
                  style={{padding: '1rem', marginBottom: '1rem'}}
                >
                  {component}
                </span>
              </SortableComponent>
            ))}
          </DropZone>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default FormDesigner;
