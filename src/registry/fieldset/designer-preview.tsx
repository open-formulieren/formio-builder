import {FieldsetComponentSchema} from '@open-formulieren/types';

import {ComponentsPreview} from '@/components/designer/Preview';
import {getDropzoneId} from '@/components/designer/dragDrop/utils/dropzone';
import {FieldSet} from '@/components/formio';
import type {ComponentPreviewProps} from '@/registry/types';

const Preview: React.FC<ComponentPreviewProps<FieldsetComponentSchema>> = ({component}) => {
  const {label, hideHeader, tooltip, components} = component;

  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      <ComponentsPreview dropzoneId={getDropzoneId(component)} components={components} />
    </FieldSet>
  );
};

export default Preview;
