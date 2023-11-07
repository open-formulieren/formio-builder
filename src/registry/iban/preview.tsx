import {IbanComponentSchema} from '@open-formulieren/types';

import {TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio iban component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<IbanComponentSchema>> = ({component}) => {
  const {key, label, description, placeholder, tooltip, validate = {}, multiple} = component;
  const {required = false} = validate;
  return (
    <TextField
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default Preview;
