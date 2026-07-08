import type {Data} from '@dnd-kit/abstract';
import type {Draggable, Droppable} from '@dnd-kit/dom';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/react';
import {DragDropProvider, DragOverlay} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {clsx} from 'clsx';
import {produce} from 'immer';
import {useCallback, useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import ComponentEditForm from '@/components/ComponentEditForm';
import Modal from '@/components/Modal';
import {SortableItemView} from '@/components/designer/dragDrop';
import {
  assertNoPlaceholders,
  createComponent,
  getDropzoneComponents,
  insertComponentDefinition,
  removeComponent,
  removePlaceholder,
  replaceComponent,
  replacePlaceholderWithComponent,
} from '@/components/designer/dragDrop/utils/components';
import {getTargetDropzoneId, getTargetIndex} from '@/components/designer/dragDrop/utils/dragTarget';
import {MAIN_DROPZONE_ID} from '@/components/designer/dragDrop/utils/dropzone';
import type {DesignerContextType} from '@/context';
import {DesignerContext} from '@/context';
import {getRegistryEntry} from '@/registry';

import ComponentsList from './ComponentsList';
import {ComponentPreview, ComponentsPreview} from './Preview';
import type {DraggableMenuItemData, SortableItemData} from './dragDrop';
import type {ComponentDefinition, ComponentEvent, ComponentPlaceholder} from './types';
import {COMPONENT_PLACEHOLDER_TYPE} from './types';

const getData = (
  prop: Draggable<SortableItemData | DraggableMenuItemData | Data> | Droppable | null
): SortableItemData | DraggableMenuItemData | Data => prop?.data ?? {};

export interface FormioDefinitionDesignerProps {
  /**
   * The components to display in the designer.
   *
   * This is used as the initial value for local form designer state management, later
   * updates are ignored.
   */
  initialComponents: AnyComponentSchema[];
  /**
   * The component namespaces used to determine key uniqueness when creating new
   * components.
   */
  componentNamespace: AnyComponentSchema[];
  /**
   * Callback function that is called when the components have been changed.
   *
   * The `event` is an optional argument that is only present when a component is
   * created, updated, or deleted. For other change events (i.e. dragging components
   * around), this argument is not present.
   */
  onChange: (components: AnyComponentSchema[], event?: ComponentEvent) => void;
}

const FormioDefinitionDesigner: React.FC<FormioDefinitionDesignerProps> = ({
  initialComponents,
  componentNamespace,
  onChange,
}) => {
  const intl = useIntl();
  const [items, setItems] = useState<ComponentDefinition[]>(initialComponents);
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

    const newItems = produce(items, draftItems => {
      removePlaceholder(draftItems);
      insertComponentDefinition(index, draftItems, dropzoneId, placeholder);
    });
    setItems(newItems);
  };

  const moveComponent = (index: number, dropzoneId: string, component: AnyComponentSchema) => {
    const newItems = produce(items, draftItems => {
      removeComponent(draftItems, component.key);
      insertComponentDefinition(index, draftItems, dropzoneId, component);
    });
    setItems(newItems);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {source, target} = event.operation;
    const sourceData = getData(source);
    const isNewComponent: boolean = sourceData?.fromSidebar || false;

    // When moving the placeholder outside the dropzone, remove it.
    if (!target && isNewComponent) {
      const newItems = produce(items, draftItems => {
        removePlaceholder(draftItems);
      });
      setItems(newItems);
      return;
    }

    const dropzoneId = getTargetDropzoneId(target);
    if (!dropzoneId) return;

    const dropzoneComponents = getDropzoneComponents(items, dropzoneId);
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

    // When moving an existing component, we simply persist the items state.
    if (!isNewComponent) {
      assertNoPlaceholders(items);
      onChange(items);
      return;
    }

    // If there is no target, it means the drag ended outside a dropzone.
    if (!target) return;

    // Create the new component and open it in the edit modal.
    const newComponent = createComponent(sourceData.componentType, componentNamespace, intl);
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

  const updateComponent = (
    component: AnyComponentSchema,
    previousComponent: AnyComponentSchema,
    isNew: boolean
  ) => {
    const newItems = produce(items, draftItems => {
      if (isNew) {
        replacePlaceholderWithComponent(draftItems, component);
      } else {
        replaceComponent(draftItems, previousComponent.key, component);
      }
    });

    setItems(newItems);
    assertNoPlaceholders(newItems);

    onChange(
      newItems,
      isNew
        ? {
            type: 'created',
            component,
          }
        : {
            type: 'updated',
            component,
            originalComponent: previousComponent,
          }
    );
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

      const newItems = produce(items, draftItems => {
        removeComponent(draftItems, component.key);
      });
      setItems(newItems);

      assertNoPlaceholders(newItems);
      onChange(newItems, {type: 'deleted', component});
    },
    [intl, items, onChange]
  );

  const deletePlaceholder = useCallback(() => {
    const newItems = produce(items, draftItems => {
      removePlaceholder(draftItems);
    });
    setItems(newItems);
  }, [items]);

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
            <ComponentsPreview components={items} dropzoneId={MAIN_DROPZONE_ID} />
          </div>
        </div>
        {componentToEdit && (
          <ComponentEditModal
            component={componentToEdit.component}
            isNew={componentToEdit.isNew}
            onSubmit={component => {
              updateComponent(component, componentToEdit.component, componentToEdit.isNew);
              closeModal();
            }}
            onRemove={() => {
              if (componentToEdit.isNew) {
                deletePlaceholder();
              } else {
                deleteComponent(componentToEdit.component);
              }
              closeModal();
            }}
            onClose={() => {
              deletePlaceholder();
              closeModal();
            }}
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

  return (
    <Modal isOpen closeModal={onClose}>
      <ComponentEditForm
        component={component}
        isNew={isNew}
        builderInfo={builderInfo}
        onSubmit={onSubmit}
        onRemove={onRemove}
        onCancel={onClose}
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
