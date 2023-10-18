import {PostcodeComponentSchema} from '@open-formulieren/types';

import {TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const defaultValidate = {
  required: false,
  pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
};

/**
 * Show a formio postcode component preview.
 *
 * @deprecated - The custom component type is deprecated in favour of a text
 * field-based preset.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<PostcodeComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    tooltip,
    validate = defaultValidate,
    autocomplete = '',
    disabled = false,
    multiple,
    inputMask,
  } = component;
  const {required = false, pattern} = validate;
  return (
    <TextField
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      required={required}
      autoComplete={autocomplete}
      readOnly={disabled}
      inputMask={inputMask}
      pattern={pattern}
    />
  );
};

export default Preview;
