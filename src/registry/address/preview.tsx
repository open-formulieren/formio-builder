import {LicensePlateComponentSchema} from '@open-formulieren/types';

import {Component, Description} from '@/components/formio';


import {ComponentPreviewProps} from '../types';

/**
 * Show a formio iban component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<LicensePlateComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate} = component;

  const {required = false} = validate;
  return (
    <Component
      type="address"
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      <fieldset>
        
      </fieldset>
    </Component>
  );
};

export default Preview;
