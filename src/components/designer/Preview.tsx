import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {useIntl} from 'react-intl';

import ErrorBoundary from '@/components/error/ErrorBoundary';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import './Preview.scss';
import {DraggableItem, DropZone} from './dragDrop';

export interface ComponentsPreviewProps {
  components: AnyComponentSchema[];
}

export const ComponentsPreview: React.FC<ComponentsPreviewProps> = ({components}) => {
  return (
    <div className="offb-designer-preview-container">
      <ErrorBoundary>
        <DropZone id="main-dropzone">
          {components.map((component, index) => (
            <DraggableItem key={component.key} id={component.key} index={index}>
              <ComponentPreview component={component} />
            </DraggableItem>
          ))}
        </DropZone>
      </ErrorBoundary>
    </div>
  );
};

interface ComponentPreviewProps {
  component: AnyComponentSchema;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const intl = useIntl();
  const entry = getRegistryEntry(component);
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
