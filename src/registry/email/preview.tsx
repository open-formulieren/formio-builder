import {EmailComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {TextField} from '@/components/formio';
import FAQItem from '@/components/formio/faq-item';

import {ComponentPreviewProps} from '../types';
import './previews.scss';

/**
 * Show a formio email component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<EmailComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    tooltip,
    faqItems = [],
    validate = {},
    autocomplete,
    multiple,
    openForms,
  } = component;
  const {required = false} = validate;
  const requireVerification = openForms?.requireVerification ?? false;

  const verificationButton = requireVerification ? (
    <button type="button" className="btn btn-primary">
      <FormattedMessage description="Email verification button text" defaultMessage="Verify" />
    </button>
  ) : null;
  const faqElements = faqItems.map(faqItem => <FAQItem faqItem={faqItem} />);
  return (
    <>
      <TextField
        name={key}
        multiple={!!multiple}
        label={label}
        description={description}
        tooltip={tooltip}
        faqElements={faqElements}
        required={required}
        autoComplete={autocomplete}
        type="email"
        childrenAfterField={verificationButton}
      />
    </>
  );
};

export default Preview;
