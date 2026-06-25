import {TextareaComponentSchema} from '@open-formulieren/types';

import {TextArea} from '@/components/formio';
import FAQItem from '@/components/formio/faq-item';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio textarea component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<TextareaComponentSchema>> = ({component}) => {
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
    multiple,
    showCharCount,
    rows,
    autoExpand = false,
  } = component;
  const {required = false} = validate;
  const faqElements = faqItems.map(faqItem => <FAQItem faqItem={faqItem} />);
  return (
    <TextArea
      name={key}
      multiple={!!multiple}
      label={label}
      description={description}
      tooltip={tooltip}
      faqElements={faqElements}
      placeholder={placeholder}
      required={required}
      autoComplete={autocomplete}
      readOnly={disabled}
      showCharCount={showCharCount}
      autoExpand={autoExpand}
      rows={rows}
    />
  );
};

export default Preview;
