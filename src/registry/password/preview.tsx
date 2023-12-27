import {PasswordComponentSchema} from '@open-formulieren/types';

import {TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio password component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<PasswordComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate = {}, autocomplete = '', multiple} = component;
  const {required = false} = validate;
  return (
    <TextField
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      autoComplete={autocomplete}
      required={required}
      type="password"
    />
  );
};

export default Preview;
