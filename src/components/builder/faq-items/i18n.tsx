import type {FAQItem} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {MinimalEditor} from '@/components/CKEditor';
import RichText from '@/components/builder/rich-text';
import {TextField} from '@/components/formio';

import {ComponentTranslationsContext} from '../i18n';

/**
 * Manage the translations of properties for FAQ items.
 *
 * This component is intended to be passed as a child component to
 * `ComponentTranslations` so that all translations are managed in a single
 * tab.
 */
function FAQItemsTranslations() {
  const intl = useIntl();
  const {activeLanguage} = useContext(ComponentTranslationsContext);
  const {getFieldProps} = useFormikContext();
  const name = 'faqItems';
  const {value: faqItems = []} = getFieldProps<FAQItem[] | undefined>(name);

  return (
    faqItems.length > 0 && (
      <tbody>
        <tr>
          <th colSpan={3} style={{textAlign: 'end'}}>
            <FormattedMessage
              description="Title for translation group for FAQ items"
              defaultMessage="FAQ item translations"
            />
          </th>
        </tr>

        {faqItems.map(({id, label, content}, index) => (
          <React.Fragment key={id}>
            <tr>
              <td>
                <span className="offb-table__content offb-table__content--allow-break">
                  <FormattedMessage
                    description="Label for FAQ item label"
                    defaultMessage="FAQ item {index} label"
                    values={{
                      index,
                    }}
                  />
                </span>
              </td>
              <td>
                <span className="offb-table__content offb-table__content--allow-break">
                  {label || '-'}
                </span>
              </td>
              <td>
                <TextField
                  name={`${name}[${index}]openForms.translations.${activeLanguage}.label`}
                  aria-label={intl.formatMessage(
                    {
                      description: 'Accessible label for label for FAQ item',
                      defaultMessage: 'Translation for label with value "{value}"',
                    },
                    {value: label}
                  )}
                />
              </td>
            </tr>

            <tr>
              <td>
                <span className="offb-table__content offb-table__content--allow-break">
                  <FormattedMessage
                    description="Label for FAQ item content"
                    defaultMessage="FAQ item {index} content"
                    values={{
                      index,
                    }}
                  />
                </span>
              </td>
              <td>
                <span className="offb-table__content offb-table__content--allow-break">
                  <div dangerouslySetInnerHTML={{__html: content}} />
                </span>
              </td>
              <td>
                <RichText
                  name={`${name}[${index}]openForms.translations.${activeLanguage}.content`}
                  supportsBackendTemplating={false}
                  editor={MinimalEditor}
                />
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    )
  );
}

export default FAQItemsTranslations;
