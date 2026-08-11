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
        <div className="faq-items">
          {faqItems.map((faqItem, index) => (
            <div className="faq-item" key={faqItem.id}>
              <div className="form-group">
                <TextField
                  name={`${arrayHelpers.name}[${index}].label`}
                  required={true}
                  label={
                    <FormattedMessage
                      description="Label for FAQ item label configuration field"
                      defaultMessage="Label"
                    />
                  }
                />
              </div>

              <div className="form-group">
                <span className="faq-item__label col-form-label field-required">
                  <FormattedMessage
                    description="Label for FAQ item content configuration field"
                    defaultMessage="Content"
                  />
                </span>

                <RichText
                  name={`${arrayHelpers.name}[${index}].content`}
                  supportsBackendTemplating={false}
                  required={true}
                  editor={MinimalEditor}
                />
              </div>

              <div className="faq-item__controls">
                <button
                  className="faq-item__remove btn btn-secondary "
                  type="button"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  <i className="fa fa-times-circle-o" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="faq-items__add btn"
            onClick={() => {
              arrayHelpers.push({
                id: window.crypto.randomUUID(),
                label: '',
                content: '',
              });
            }}
          >
            <i className="fa fa-plus" aria-hidden="true" />{' '}
            <FormattedMessage
              description="'Add FAQ item' button text"
              defaultMessage="Add FAQ item"
            />
          </button>
        </div>
      )}
    </FieldArray>
  );
};

export default FAQItems;
