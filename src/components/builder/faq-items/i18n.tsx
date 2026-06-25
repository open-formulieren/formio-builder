import type {FAQItem} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {TextArea, TextField} from '@/components/formio';
import {BuilderContext} from '@/context';

import {ComponentTranslationsContext} from '../i18n';

// TODO: use different layout for faq item configuration, content values won't
// show properly inside a table cell.
export function FAQItemsTranslations() {
  const intl = useIntl();
  const {activeLanguage} = useContext(ComponentTranslationsContext);
  const {getFieldProps} = useFormikContext();
  const name = 'faqItems';
  const {value: faqItems = []} = getFieldProps<FAQItem[] | undefined>(name);

  const {formType} = useContext(BuilderContext);
  return formType === 'appointment' ? null : (
    <>
      {faqItems.map((faqItem, index) => (
        <tbody key={`faq-item-${index}`}>
          <tr>
            <th colSpan={3} style={{textAlign: 'end'}}>
              <FormattedMessage
                description="FAQ item translations table header"
                defaultMessage="FAQ item {index} translations"
                values={{
                  index: index + 1, // start counting from 1
                }}
              />
            </th>
          </tr>

          <tr key={`label-${index}`}>
            <td>
              <span id={`faq-item-${index}-label`}>
                <FormattedMessage
                  description="Label for FAQ item label location"
                  defaultMessage="Label"
                />
              </span>
            </td>
            <td>
              <div
                aria-describedby={`faq-item-${index}-label`}
                className="offb-table__content offb-table__content--allow-break"
              >
                {faqItem.label}
              </div>
            </td>

            <td>
              <TextField
                name={`${name}[${index}]openForms.translations.${activeLanguage}.label`}
                aria-label={intl.formatMessage(
                  {
                    description: 'Accessible label for label translation field',
                    defaultMessage: 'Translation for label with value "{value}"',
                  },
                  {value: faqItem.label}
                )}
              />
            </td>
          </tr>

          <tr key={`content-${index}`}>
            <td>
              <span id={`faq-item-${index}-content`}>
                <FormattedMessage
                  description="Label for FAQ item content location"
                  defaultMessage="Content"
                />
              </span>
            </td>
            <td>
              <div
                aria-describedby={`faq-item-${index}-content`}
                className="offb-table__content offb-table__content--allow-break"
              >
                <div dangerouslySetInnerHTML={{__html: faqItem.content}} />
              </div>
            </td>
            <td>
              <TextArea
                name={`${name}[${index}]openForms.translations.${activeLanguage}.content`}
                aria-label={intl.formatMessage({
                  description: 'Accessible label for content translation field',
                  defaultMessage: 'Translation for content',
                })}
              />
            </td>
          </tr>
        </tbody>
      ))}
    </>
  );
}

export default FAQItemsTranslations;
