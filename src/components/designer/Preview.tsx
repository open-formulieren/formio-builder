import {useDragOperation} from '@dnd-kit/react';
import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {FormattedMessage, useIntl} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import './Preview.scss';
import {DropZone, SortableComponent} from './dragDrop';
import {getTargetDropzoneId} from './dragDrop/utils/dragTarget';
import type {ComponentPlaceholder} from './types';
import {COMPONENT_PLACEHOLDER_TYPE} from './types';

export interface ComponentsPreviewProps {
  components: (AnyComponentSchema | ComponentPlaceholder)[];
  dropzoneId: string;
  hideEmptyMessage?: boolean;
  withoutComponentControls?: boolean;
}

export const ComponentsPreview: React.FC<ComponentsPreviewProps> = ({
  components,
  dropzoneId,
  hideEmptyMessage = false,
  withoutComponentControls = false,
}) => {
  const {target} = useDragOperation();
  const dropzone = getTargetDropzoneId(target);

  const isDraggingAboveDropzone = dropzone === dropzoneId;
  // Count the number of components in the dropzone, excluding dragged components.
  const hasComponents = isDraggingAboveDropzone ? components.length > 1 : components.length > 0;

  return (
    <ErrorBoundary>
      <DropZone id={dropzoneId}>
        {!hasComponents && <EmptyComponentsPreviewMessage hideEmptyMessage={hideEmptyMessage} />}
        {components.map((component, index) =>
          component.type === COMPONENT_PLACEHOLDER_TYPE ? (
            <ComponentPlaceholderPreview
              key="placeholder"
              componentType={component.componentType}
            />
          ) : (
            <SortableComponent
              key={component.key}
              id={component.id}
              index={index}
              groupName={dropzoneId}
              component={component}
              hasControls={!withoutComponentControls}
            >
              <ComponentPreview component={component} />
            </SortableComponent>
          )
        )}
      </DropZone>
    </ErrorBoundary>
  );
};

interface EmptyComponentsPreviewMessageProps {
  hideEmptyMessage: boolean;
}

const EmptyComponentsPreviewMessage: React.FC<EmptyComponentsPreviewMessageProps> = ({
  hideEmptyMessage,
}) => (
  <ContentPlaceholder variant="designer">
    {hideEmptyMessage && '+'}
    <div
      className={clsx({
        'sr-only': hideEmptyMessage,
      })}
    >
      <FormattedMessage
        description="Components preview empty content description"
        defaultMessage="Drag a component in the form and release the mouse button."
      />
    </div>
  </ContentPlaceholder>
);

interface ComponentPlaceholderPreviewProps {
  componentType: AnyComponentSchema['type'];
}

const ComponentPlaceholderPreview: React.FC<ComponentPlaceholderPreviewProps> = ({
  componentType,
}) => {
  const {formDesigner, builderInfo} = getRegistryEntry(componentType);

  return (
    <ContentPlaceholder key="spacer" variant="designer" testId="component-placeholder">
      <i className={clsx('fa', `fa-${builderInfo.icon}`, 'mr-2')} aria-hidden="true" />
      <FormattedMessage {...formDesigner.label} />
    </ContentPlaceholder>
  );
};

interface ComponentPreviewProps {
  component: AnyComponentSchema;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const intl = useIntl();
  const entry = getRegistryEntry(component.type);
  const {
    preview: {designer: PreviewComponent},
  } = entry;
  // @TODO Remove the undefined check when all components have a designer preview.
  if (PreviewComponent === undefined || PreviewComponent === null) {
    console.info(`No designer preview found for component ${component.type}.`);
    return null;
  }

  const isHidden = hasOwnProperty(component, 'hidden') ? component.hidden : false;

  return (
    <div
      className={clsx(
        'offb-designer-preview',
        `offb-designer-preview--component-type-${component.type}`,
        {
          'offb-designer-preview--hidden': isHidden,
        }
      )}
      data-testid="designerPreview"
      title={
        isHidden
          ? intl.formatMessage({
              description: 'Form designer preview hidden component title',
              defaultMessage: 'Hidden component',
            })
          : undefined
      }
    >
      <PreviewComponent component={component} />
    </div>
  );
};

export default ComponentsPreview;
