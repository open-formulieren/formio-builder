import type {ColumnsComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import {ComponentPreview} from '@/components/designer/Preview';
import {DraggableItem, DropZone} from '@/components/designer/dragDrop';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Component from '@/components/formio/component';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<ColumnsComponentSchema>> = ({component}) => {
  const {key, columns} = component;

  return (
    <Component type="columns" field={key} htmlId={`editform-${key}`}>
      <ErrorBoundary>
        <div className="row" data-testid={`columns-${key}`}>
          {columns.map((column, index) => (
            <div
              className={clsx('col', `col-${column.size}`)}
              data-testid={`${key}-column-${index}`}
              key={index}
            >
              <DropZone>
                {column.components.length ? (
                  column.components.map(component => (
                    <DraggableItem key={component.key}>
                      <ComponentPreview component={component} />
                    </DraggableItem>
                  ))
                ) : (
                  <ContentPlaceholder variant="designer">
                    +
                    <div className="sr-only">
                      <FormattedMessage
                        description="Column designer preview content description"
                        defaultMessage="Drag a component in the form and release the mouse button"
                      />
                    </div>
                  </ContentPlaceholder>
                )}
              </DropZone>
            </div>
          ))}
        </div>
      </ErrorBoundary>
    </Component>
  );
};

export default Preview;
