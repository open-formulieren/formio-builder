import type {Data} from '@dnd-kit/abstract';
import type {Draggable, Droppable} from '@dnd-kit/dom';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/react';
import {DragDropProvider, DragOverlay} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {current} from 'immer';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useImmer} from 'use-immer';

import {
  createComponent,
  removeComponentFromDraft,
  removePlaceholderFromDraft,
  replacePlaceholderWithComponent,
} from '@/components/designer/dragDrop/utils/components';
import {getTargetIndex} from '@/components/designer/dragDrop/utils/dragTarget';
import {MAIN_DROPZONE_ID} from '@/components/designer/dragDrop/utils/dropzone';
import {DesignerContext} from '@/context';
import {getRegistryEntry} from '@/registry';

import ComponentsList from './ComponentsList';
import ComponentsPreview, {ComponentPreview} from './Preview';
import type {DraggableMenuItemData, SortableItemData} from './dragDrop';
import type {ComponentPlaceholder} from './types';
import {COMPONENT_PLACEHOLDER_TYPE} from './types';

const getData = (
  prop: Draggable<SortableItemData | DraggableMenuItemData | Data> | Droppable | null
): SortableItemData | DraggableMenuItemData | Data => prop?.data ?? {};

export interface FormioDefinitionDesignerProps {
  components: AnyComponentSchema[];
  onChange: (components: AnyComponentSchema[]) => void;
}

const FormioDefinitionDesigner: React.FC<FormioDefinitionDesignerProps> = ({
  components,
  onChange,
}) => {
  const {componentNamespace} = useContext(DesignerContext);
  const intl = useIntl();
  const [items, setItems] = useImmer<{components: (AnyComponentSchema | ComponentPlaceholder)[]}>({
    components,
  });

  const movePlaceholder = (index: number, componentType: AnyComponentSchema['type']) => {
    const placeholder: ComponentPlaceholder = {
      type: COMPONENT_PLACEHOLDER_TYPE,
      componentType,
    };

    setItems(draft => {
      removePlaceholderFromDraft(draft);

      draft.components.splice(index, 0, placeholder);
    });
  };

  const moveComponent = (index: number, component: AnyComponentSchema) => {
    setItems(draft => {
      removeComponentFromDraft(draft, component.key);

      draft.components.splice(index, 0, component);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);
    const isNewComponent: boolean = sourceData?.fromSidebar || false;

    // When moving the placeholder outside the dropzone, remove it.
    if (!target && isNewComponent) {
      setItems(draft => {
        removePlaceholderFromDraft(draft);
      });
      return;
    }

    const targetIndex = getTargetIndex(target, items.components.length);
    if (targetIndex === undefined) return;

    if (isNewComponent) {
      movePlaceholder(targetIndex, sourceData.componentType);
    } else if (sourceData?.component) {
      moveComponent(targetIndex, sourceData.component);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {source} = event.operation;
    const sourceData = getData(source);
    const isNewComponent: boolean = sourceData?.fromSidebar;

    // For existing components we don't need any additional actions.
    if (!isNewComponent) return;

    const newComponent = createComponent(sourceData.componentType, componentNamespace, intl);
    setItems(draft => {
      replacePlaceholderWithComponent(draft.components, newComponent);

      // @TODO cleanup, kinda dirty
      // At this point draft.components should only contain component definitions.
      onChange(current(draft.components) as AnyComponentSchema[]);
    });
  };

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <DragOverlay dropAnimation={null}>
        {source =>
          source.data?.fromSidebar ? (
            <PlaceholderDragOverlay componentType={source.data.componentType} />
          ) : (
            <ComponentPreview component={source.data.component} />
          )
        }
      </DragOverlay>

      <div className="row">
        <div className="col col-2">
          <ComponentsList />
        </div>
        <div className="col col-10">
          <ComponentsPreview components={items.components} dropzoneId={MAIN_DROPZONE_ID} />
        </div>
      </div>
    </DragDropProvider>
  );
};

interface PlaceholderDragOverlayProps {
  componentType: AnyComponentSchema['type'];
}

const PlaceholderDragOverlay: React.FC<PlaceholderDragOverlayProps> = ({componentType}) => {
  const {formDesigner, builderInfo} = getRegistryEntry(componentType);
  return (
    <span className="btn btn-primary btn-block">
      <i className={clsx('fa', `fa-${builderInfo.icon}`, 'mr-2')} aria-hidden="true" />
      <FormattedMessage {...formDesigner.label} />
    </span>
  );
};

export default FormioDefinitionDesigner;
