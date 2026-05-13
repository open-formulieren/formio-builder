import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {FormattedMessage, useIntl} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import './Preview.scss';
import {DropZone, SortableComponent} from './dragDrop';
import type {ComponentPlaceholder} from './types';
import {COMPONENT_PLACEHOLDER_TYPE} from './types';

export interface ComponentsPreviewProps {
  components: (AnyComponentSchema | ComponentPlaceholder)[];
}

export const ComponentsPreview: React.FC<ComponentsPreviewProps> = ({components}) => {
  return (
    <div className="offb-designer-preview-container">
      <ErrorBoundary>
        <DropZone id="main-dropzone">
          {components.map((component, index) =>
            component.type === COMPONENT_PLACEHOLDER_TYPE ? (
              <ComponentPlaceholderPreview componentType={component.componentType} />
            ) : (
              <SortableComponent
                key={component.key}
                id={component.id}
                index={index}
                groupName="main-dropzone"
                component={component}
              >
                <ComponentPreview component={component} />
              </SortableComponent>
            )
          )}
        </DropZone>
      </ErrorBoundary>
    </div>
  );
};

interface ComponentPlaceholderPreviewProps {
  componentType: AnyComponentSchema['type'];
}

const ComponentPlaceholderPreview: React.FC<ComponentPlaceholderPreviewProps> = ({
  componentType,
}) => {
  const {formDesigner, builderInfo} = getRegistryEntry(componentType);

  return (
    <ContentPlaceholder key="spacer" variant="designer">
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
