import type {EditGridComponentSchema} from '@open-formulieren/types';

import {ComponentsPreview} from '@/components/designer/Preview';
import {getDropzoneId} from '@/components/designer/dragDrop/utils/dropzone';
import {Description} from '@/components/formio';
import Component from '@/components/formio/component';
import type {ComponentPreviewProps} from '@/registry/types';

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
      <ComponentsPreview dropzoneId={getDropzoneId(component)} components={components} />

      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
