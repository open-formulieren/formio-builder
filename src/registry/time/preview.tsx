import {TimeComponentSchema} from '@open-formulieren/types';

import {TimeField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio time component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<TimeComponentSchema>> = ({component}) => {
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
    <TimeField
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
