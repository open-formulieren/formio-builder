import type {EditGridComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import {ComponentPreview} from '@/components/designer/Preview';
import {DraggableItem, DropZone} from '@/components/designer/dragDrop';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import {Description} from '@/components/formio';
import Component from '@/components/formio/component';

import type {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<EditGridComponentSchema>> = ({component}) => {
  const {key, label, description, validate = {}, tooltip, components, hideLabel} = component;
  const {required = false} = validate;

  return (
    <Component
      type="editgrid"
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={hideLabel ? undefined : label}
      tooltip={tooltip}
    >
      <ErrorBoundary>
        <DropZone>
          {components.length ? (
            components.map(nestedComponent => (
              <DraggableItem key={nestedComponent.key}>
                <ComponentPreview component={nestedComponent} />
              </DraggableItem>
            ))
          ) : (
            <ContentPlaceholder variant="designer">
              <FormattedMessage
                description="Editgrid designer preview content description"
                defaultMessage="Drag a component in the form and release the mouse button"
              />
            </ContentPlaceholder>
          )}
        </DropZone>
      </ErrorBoundary>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
