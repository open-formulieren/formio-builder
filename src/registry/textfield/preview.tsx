import type {TextFieldComponentSchema} from '@open-formulieren/types';

import {TextField} from '@/components/formio';

import type {ComponentPreviewProps} from '../types';

/**
 * Show a formio textfield component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<TextFieldComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    placeholder,
    tooltip,
    faqItems = [],
    validate = {},
    autocomplete = '',
    disabled = false,
    showCharCount,
    multiple,
  } = component;
  const {required = false} = validate;
  return (
    <TextField
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      faqItems={faqItems}
      placeholder={placeholder}
      required={required}
      autoComplete={autocomplete}
      readOnly={disabled}
      showCharCount={showCharCount}
    />
  );
};

export default Preview;
