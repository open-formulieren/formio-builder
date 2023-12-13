import {CosignV1ComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio cosignV1 component preview.
 */
const Preview: React.FC<ComponentPreviewProps<CosignV1ComponentSchema>> = ({component}) => {
  const {label, key, description, authPlugin} = component;
  return (
    <Component type={component.type} field={key} htmlId={`editform-${key}`} label={label}>
      <div>
        <button className="btn btn-primary" type="button">
          <FormattedMessage
            description="Preview of cosign v1: login button label"
            defaultMessage="Cosign ({authPlugin})"
            values={{authPlugin}}
          />
        </button>
      </div>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
