import type {Data} from '@dnd-kit/abstract';
import type {Draggable, Droppable} from '@dnd-kit/dom';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/react';
import {DragDropProvider, DragOverlay} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {current} from 'immer';
import {useCallback, useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useImmer} from 'use-immer';

import ComponentEditForm from '@/components/ComponentEditForm';
import Modal from '@/components/Modal';
import {SortableItemView} from '@/components/designer/dragDrop';
import {
  assertNoPlaceholders,
  createComponent,
  getDropzoneComponents,
  removeComponent,
  removePlaceholder,
  replaceComponent,
  replacePlaceholderWithComponent,
} from '@/components/designer/dragDrop/utils/components';
import {getTargetDropzoneId, getTargetIndex} from '@/components/designer/dragDrop/utils/dragTarget';
import {MAIN_DROPZONE_ID} from '@/components/designer/dragDrop/utils/dropzone';
import {DesignerContext, DesignerContextType} from '@/context';
import {getRegistryEntry} from '@/registry';

import ComponentsList from './ComponentsList';
import ComponentsPreview, {ComponentPreview} from './Preview';
import type {DraggableMenuItemData, SortableItemData} from './dragDrop';
import type {ComponentDefinition, ComponentPlaceholder} from './types';
import {COMPONENT_PLACEHOLDER_TYPE} from './types';

const getData = (
  prop: Draggable<SortableItemData | DraggableMenuItemData | Data> | Droppable | null
): SortableItemData | DraggableMenuItemData | Data => prop?.data ?? {};

export interface FormioDefinitionDesignerProps {
  components: AnyComponentSchema[];
  componentNamespace: AnyComponentSchema[];
  onChange: (components: AnyComponentSchema[]) => void;
}

const FormioDefinitionDesigner: React.FC<FormioDefinitionDesignerProps> = ({
  components,
  componentNamespace,
  onChange,
}) => {
  const intl = useIntl();
  const [items, setItems] = useImmer<{components: ComponentDefinition[]}>({
    components,
  });
  const [componentToEdit, setComponentToEdit] = useState<{
    component: AnyComponentSchema;
    isNew: boolean;
  } | null>(null);

  const movePlaceholder = (
    index: number,
    dropzoneId: string,
    componentType: AnyComponentSchema['type']
  ) => {
    const placeholder: ComponentPlaceholder = {
      type: COMPONENT_PLACEHOLDER_TYPE,
      componentType,
    };

    setItems(draft => {
      removePlaceholder(draft.components);

      const dropzoneComponents = getDropzoneComponents(draft.components, dropzoneId);
      if (dropzoneComponents === undefined) return;

      dropzoneComponents.splice(index, 0, placeholder);
    });
  };

  const moveComponent = (index: number, dropzoneId: string, component: AnyComponentSchema) => {
    setItems(draft => {
      removeComponent(draft.components, component.key);

      const dropzoneComponents = getDropzoneComponents(draft.components, dropzoneId);
      if (dropzoneComponents === undefined) return;

      dropzoneComponents.splice(index, 0, component);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);
    const isNewComponent: boolean = sourceData?.fromSidebar || false;

    // When moving the placeholder outside the dropzone, remove it.
    if (!target && isNewComponent) {
      setItems(draft => {
        removePlaceholder(draft.components);
      });
      return;
    }

    const dropzoneId = getTargetDropzoneId(target);
    if (!dropzoneId) return;

    const dropzoneComponents = getDropzoneComponents(items.components, dropzoneId);
    if (dropzoneComponents === undefined) return;

    const targetIndex = getTargetIndex(target, dropzoneComponents.length);
    if (targetIndex === undefined) return;

    if (isNewComponent) {
      movePlaceholder(targetIndex, dropzoneId, sourceData.componentType);
    } else if (sourceData?.component) {
      moveComponent(targetIndex, dropzoneId, sourceData.component);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);
    const isNewComponent: boolean = sourceData?.fromSidebar;

    // For existing components we don't need any additional actions.
    if (!isNewComponent) return;

    // If there is no target, it means the drag ended outside the dropzone.
    if (!target) return;

    const newComponent = createComponent(sourceData.componentType, componentNamespace, intl);
    setItems(draft => {
      replacePlaceholderWithComponent(draft.components, newComponent);

      // After replacing the placeholder with the new component, we can be certain that
      // the collection only contains component schemas.
      const components: ComponentDefinition[] = current(draft.components);
      assertNoPlaceholders(components);
      onChange(components);
    });

    // Open the modal for the new component.
    openModal(newComponent, true);
  };

  const openModal = useCallback(
    (component: AnyComponentSchema, isNew: boolean = false) => {
      setComponentToEdit({component, isNew});
    },
    [setComponentToEdit]
  );

  const closeModal = () => {
    setComponentToEdit(null);
  };

  const updateComponent = (component: AnyComponentSchema, previousComponentKey: string) => {
    setItems(draft => {
      replaceComponent(draft.components, previousComponentKey, component);

      // Placeholders are only used for the drag and drop functionality, so there should
      // not be any in the collection at this point. Additionally, we should only send
      // component schemas to the backend.
      const components: ComponentDefinition[] = current(draft.components);
      assertNoPlaceholders(components);
      onChange(components);
    });
  };

  const deleteComponent = useCallback(
    (component: AnyComponentSchema) => {
      const {getComponentSlots} = getRegistryEntry(component.type);

      // Check if component has children components
      const isParent =
        getComponentSlots && getComponentSlots(component).some(slot => slot.collection.length > 0);

      if (
        isParent &&
        !confirm(
          intl.formatMessage({
            description: 'Form designer delete parent component confirmation message',
            defaultMessage:
              'Removing this component will also remove all of its children. Are you sure you want to continue?',
          })
        )
      ) {
        return;
      }

      setItems(draft => {
        removeComponent(draft.components, component.key);

        // Placeholders are only used for the drag and drop functionality, so there should
        // not be any in the collection at this point. Additionally, we should only send
        // component schemas to the backend.
        const components: ComponentDefinition[] = current(draft.components);
        assertNoPlaceholders(components);
        onChange(components);
      });
    },
    [setItems]
  );

  const designerContext = useMemo<DesignerContextType>(
    () => ({
      editComponent: openModal,
      deleteComponent,
    }),
    [openModal, deleteComponent]
  );

  return (
    <DesignerContext.Provider value={designerContext}>
      <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <DragOverlay dropAnimation={null}>
          {source =>
            source.data?.fromSidebar ? (
              <PlaceholderDragOverlay componentType={source.data.componentType} />
            ) : (
              <SortableItemView component={source.data.component} showControls>
                <ComponentPreview component={source.data.component} />
              </SortableItemView>
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
        {componentToEdit && (
          <ComponentEditModal
            component={componentToEdit.component}
            isNew={componentToEdit.isNew}
            onSubmit={component => {
              updateComponent(component, componentToEdit.component.key);
              closeModal();
            }}
            onRemove={() => {
              deleteComponent(componentToEdit.component);
              closeModal();
            }}
            onClose={closeModal}
          />
        )}
      </DragDropProvider>
    </DesignerContext.Provider>
  );
};

interface ComponentEditModalProps {
  component: AnyComponentSchema;
  isNew?: boolean;
  onSubmit: (component: AnyComponentSchema) => void;
  onRemove: () => void;
  onClose: () => void;
}

const ComponentEditModal: React.FC<ComponentEditModalProps> = ({
  component,
  isNew = false,
  onSubmit,
  onRemove,
  onClose,
}) => {
  const {builderInfo} = getRegistryEntry(component.type);

  // When the component is new, closing the modal without saving should remove it.
  const closeModal = () => (isNew ? onRemove() : onClose());

  return (
    <Modal isOpen closeModal={closeModal}>
      <ComponentEditForm
        component={component}
        isNew={isNew}
        builderInfo={builderInfo}
        onSubmit={onSubmit}
        onRemove={onRemove}
        onCancel={closeModal}
      />
    </Modal>
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
