import {DateComponentSchema} from '@open-formulieren/types';

import {DateField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio date component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<DateComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    tooltip,
    validate = {},
    disabled = false,
    multiple = false,
  } = component;
  const {required = false} = validate;
  return (
    <DateField
      name={key}
      multiple={multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      required={required}
      readOnly={disabled}
    />
  );
};

export default Preview;
