import type {FAQItem} from '@open-formulieren/types';
import {FieldArray, useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {MinimalEditor} from '@/components/CKEditor';
import RichText from '@/components/builder/rich-text';
import {TextField} from '@/components/formio';

import './faq-items.scss';

const FAQItems = () => {
  const fieldName = 'faqItems';
  const {getFieldProps} = useFormikContext();
  const {value: faqItems = []} = getFieldProps<FAQItem[] | undefined>(fieldName);

  return (
    <FieldArray name={fieldName}>
      {arrayHelpers => (
        <>
          {faqItems.map((_, index) => (
            <div className="faq-item" key={index}>
              <TextField
                name={`${arrayHelpers.name}[${index}].label`}
                label={
                  <FormattedMessage
                    description="Label for translation message for FAQ label"
                    defaultMessage="Label"
                  />
                }
              />

              {/* TODO: add editor label? */}
              <RichText
                name={`${arrayHelpers.name}[${index}].content`}
                supportsBackendTemplating={false}
                editor={MinimalEditor}
              />

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => arrayHelpers.remove(index)}
              >
                <i className="fa fa-times-circle-o" aria-hidden="true" />{' '}
                <FormattedMessage
                  description="'Remove item' screenreader button text"
                  defaultMessage="Remove FAQ item"
                />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary formio-button-add-another"
            onClick={() => {
              arrayHelpers.push({
                label: '',
                content: '',
              });
            }}
          >
            <i className="fa fa-plus" aria-hidden="true" />{' '}
            <FormattedMessage
              description="'Add FAQ item' button text for 'multiple' FAQ items"
              defaultMessage="Add FAQ item"
            />
          </button>
        </>
      )}
    </FieldArray>
  );
};

export default FAQItems;
