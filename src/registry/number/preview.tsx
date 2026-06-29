import {NumberComponentSchema} from '@open-formulieren/types';

import {NumberField} from '@/components/formio';
import FAQItem from '@/components/formio/faq-item';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio number component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<NumberComponentSchema>> = ({component}) => {
  // FIXME: incorporate decimalLimit and allowNegative
  const {key, label, description, tooltip, validate = {}, faqItems = [], suffix = ''} = component;
  const {required = false} = validate;
  const faqElements = faqItems.map(faqItem => <FAQItem faqItem={faqItem} />);
  return (
    <NumberField
      name={key}
      label={label}
      description={description}
      tooltip={tooltip}
      faqElements={faqElements}
      required={required}
      suffix={suffix}
    />
  );
};

export default Preview;
