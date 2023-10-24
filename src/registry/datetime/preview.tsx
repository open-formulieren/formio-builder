import {DateTimeComponentSchema} from '@open-formulieren/types';

import {DateTimeField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio date component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<DateTimeComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    placeholder,
    tooltip,
    validate = {},
    disabled = false,
    multiple = false,
  } = component;
  const {required = false} = validate;
  return (
    <DateTimeField
      name={key}
      multiple={multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      placeholder={placeholder}
      required={required}
      readOnly={disabled}
    />
  );
};

export default Preview;
