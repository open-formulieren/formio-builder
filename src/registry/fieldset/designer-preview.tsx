import {FieldsetComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import {ComponentPreview} from '@/components/designer/Preview';
import {DraggableItem, DropZone} from '@/components/designer/dragDrop';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import {FieldSet} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<FieldsetComponentSchema>> = ({component}) => {
  const {label, hideHeader, tooltip, components} = component;
  const hasComponents = components.length > 0;

  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      <ErrorBoundary>
        <DropZone>
          {hasComponents ? (
            components.map(component => (
              <DraggableItem key={component.key}>
                <ComponentPreview component={component} />
              </DraggableItem>
            ))
          ) : (
            <ContentPlaceholder variant="designer">
              <FormattedMessage
                description="Fieldset designer preview content description"
                defaultMessage="Drag a component in the form and release the mouse button"
              />
            </ContentPlaceholder>
          )}
        </DropZone>
      </ErrorBoundary>
    </FieldSet>
  );
};

export default Preview;
