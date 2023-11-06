import {CurrencyComponentSchema} from '@open-formulieren/types';

import {NumberField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio currency component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<CurrencyComponentSchema>> = ({component}) => {
  // FIXME: incorporate decimalLimit and allowNegative
  const {key, label, description, tooltip, validate = {}} = component;
  const {required = false} = validate;
  return (
    <NumberField
      name={key}
      label={label}
      description={description}
      tooltip={tooltip}
      required={required}
    />
  );
};

export default Preview;
