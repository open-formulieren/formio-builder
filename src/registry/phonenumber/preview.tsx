import {PhoneNumberComponentSchema} from '@open-formulieren/types';

import {TextField} from '@/components/formio';
import FAQItem from '@/components/formio/faq-item';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio textfield component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<PhoneNumberComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    tooltip,
    faqItems = [],
    validate = {},
    autocomplete = '',
    multiple,
  } = component;
  const {required = false} = validate;
  const faqElements = faqItems.map(faqItem => <FAQItem faqItem={faqItem} />);
  return (
    <TextField
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      faqElements={faqElements}
      required={required}
      autoComplete={autocomplete}
      inputMode="decimal"
    />
  );
};

export default Preview;
