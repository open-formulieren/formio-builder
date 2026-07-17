import type {ColumnsComponentSchema} from '@open-formulieren/types';
import {clsx} from 'clsx';

import {ComponentsPreview} from '@/components/designer/Preview';
import {getColumnDropzoneId} from '@/components/designer/dragDrop/utils/dropzone';
import Component from '@/components/formio/component';
import type {ComponentPreviewProps} from '@/registry/types';

const Preview: React.FC<ComponentPreviewProps<ColumnsComponentSchema>> = ({component}) => {
  const {key, columns} = component;

  return (
    <Component type="columns" field={key} htmlId={`editform-${key}`}>
      <div className="row" data-testid={`columns-${key}`}>
        {columns.map((column, index) => (
          <div
            className={clsx('col', `col-${column.size}`)}
            data-testid={`${key}-column-${index}`}
            key={index}
          >
            <ComponentsPreview
              dropzoneId={getColumnDropzoneId(component, index)}
              components={column.components}
              hideEmptyMessage
            />
          </div>
        ))}
      </div>
    </Component>
  );
};

export default Preview;
