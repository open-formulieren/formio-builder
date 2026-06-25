import {ChildrenComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description} from '@/components/formio';
import {FieldSet, TextField} from '@/components/formio';
import FAQItem from '@/components/formio/faq-item';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<ChildrenComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, faqItems = []} = component;

  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      <TextField
        name={`${key}.bsn`}
        label={<FormattedMessage description="Label for child's BSN" defaultMessage="BSN" />}
        value="123456788"
        disabled
      />
      <TextField
        name={`${key}.firstNames`}
        label={
          <FormattedMessage
            description="Label for child's first names"
            defaultMessage="Firstnames"
          />
        }
        value="Alan"
        disabled
      />
      <TextField
        name={`${key}.dateOfBirth`}
        label={
          <FormattedMessage
            description="Label for child's date of birth"
            defaultMessage="Date of birth"
          />
        }
        value="2000-08-09"
        disabled
      />
      {description && <Description text={description} />}

      {faqItems.map(faqItem => (
        <FAQItem faqItem={faqItem} />
      ))}
    </FieldSet>
  );
};

export default Preview;
