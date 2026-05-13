import {arrayMove} from '@dnd-kit/helpers';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/react';
import {DragDropProvider, DragOverlay} from '@dnd-kit/react';
import {isSortable} from '@dnd-kit/react/sortable';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {useRef} from 'react';
import {useImmer} from 'use-immer';

import {DropZone} from '@/components/designer/dragDrop';
import DraggableMenuItem from '@/components/designer/dragDrop/DraggableMenuItem';
import SortableComponent from '@/components/designer/dragDrop/SortableComponent';

export interface FormDesignerProps {
  components: AnyComponentSchema[];
}

const ToolboxItems: AnyComponentSchema['type'][] = ['textfield', 'select'];

const FormDesigner: React.FC<FormDesignerProps> = ({components}) => {
  const [items, setItems] = useImmer<{fields: string[]}>({
    fields: ['Item 1', 'Item 2', 'Item 3'],
  });
  const spacerInsertedRef = useRef<boolean>(false);

  const getData = prop => prop?.data ?? {};

  const onDragOver = (event: DragOverEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);

    // When moving an existing item, just let dnd-kit handle it.
    if (!sourceData?.fromSidebar) return;
    if (!isSortable(target)) return;

    console.log({target, source, index: target?.index});

    if (!spacerInsertedRef.current) {
      setItems(draft => {
        if (!draft.fields.length) {
          draft.fields.push('spacer');
        } else {
          const nextIndex = target?.index > -1 ? target?.index : draft.fields.length;
          draft.fields.splice(nextIndex, 0, 'spacer');
        }
      });
      spacerInsertedRef.current = true;
    } else if (!target) {
      setItems(draft => draft.fields.filter(i => i !== 'spacer'));
      spacerInsertedRef.current = false;
    } else {
      setItems(draft => {
        const spacerIndex = draft.fields.findIndex(item => item === 'spacer');
        const nextIndex = target?.index > -1 ? target?.index : draft.fields.length - 1;

        if (nextIndex === spacerIndex) {
          return;
        }
        draft.fields = arrayMove(draft.fields, spacerIndex, nextIndex);
      });
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    const {source, target} = event.operation;
    spacerInsertedRef.current = false;

    // Dropped the draggable outside the dropzone.
    if (!target || !isSortable(target)) {
      setItems(draft => {
        draft.fields = draft.fields.filter(i => i !== 'spacer');
      });
      return;
    }

    const sourceData = getData(source);
    if (sourceData?.fromSidebar) {
      const componentType: AnyComponentSchema['type'] = sourceData.componentType;

      setItems(draft => {
        const spacerIndex = draft.fields.findIndex(item => item === 'spacer');
        draft.fields.splice(spacerIndex, 1, `${componentType} ${Date.now()}`);

        draft.fields = arrayMove(draft.fields, spacerIndex, target?.index || 0);
      });
    }
  };

  return (
    <DragDropProvider onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <DragOverlay disabled={source => !source?.data?.fromSidebar} dropAnimation={null}>
        <div>Draggable fo</div>
      </DragOverlay>

      <div className="row">
        <div className="col col-2">
          {ToolboxItems.map(item => (
            <DraggableMenuItem key={item} type={item} />
          ))}
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
