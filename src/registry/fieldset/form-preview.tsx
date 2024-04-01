import {FieldsetComponentSchema} from '@open-formulieren/types';

import {RenderComponent} from '@/components/FormPreview';
import {FieldSet} from '@/components/formio';

import {FormPreviewProps} from '../types';

/**
 * Show a formio fieldset component preview.
 */
const FormPreview: React.FC<FormPreviewProps<FieldsetComponentSchema>> = ({component}) => {
  const {label, hideHeader, tooltip, components} = component;
  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      <div>
        {components.map(component => (
          <RenderComponent key={component.id} component={component} />
        ))}
      </div>
    </FieldSet>
  );
};

export default FormPreview;
