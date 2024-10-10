import {Option} from '@open-formulieren/types/lib/formio/common';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {TextArea, TextField} from '@/components/formio';
import {PathsForValueType} from '@/types';

import {ComponentTranslationsContext} from '../i18n';

export interface ValuesTranslationsProps<S> {
  /**
   * Name of the field holding the (component) values, e.g. `values` or `data.values`.
   */
  name: PathsForValueType<S, Option[]> & string;
  withOptionDescription?: boolean;
}

/**
 * Manage the values/options translations for a component.
 *
 * This component is intended to be passed as a child component to
 * `ComponentTranslations` so that all translations are managed in a single
 * tab.
 */
export function ValuesTranslations<S>({name, withOptionDescription}: ValuesTranslationsProps<S>) {
  const intl = useIntl();
  const {activeLanguage} = useContext(ComponentTranslationsContext);
  const {getFieldProps} = useFormikContext<S>();
  const {value: options = []} = getFieldProps<Option[] | undefined>(name);
  return (
    // Same markup as ComponentTranslations<S> body
    <>
      <tbody>
        <tr>
          <th colSpan={3} style={{textAlign: 'end'}}>
            <FormattedMessage
              description="Values/options translations table header"
              defaultMessage="Choice/option translations"
            />
          </th>
        </tr>

        {options.map(({value, label}, index) => (
          <>
            <tr key={`option-${index}`}>
              <td>
                <span
                  id={`option-${index}-label`}
                  className="offb-table__content offb-table__content--allow-break"
                >
                  {label}
                </span>
              </td>
              <td>
                <div
                  aria-describedby={`option-${index}-label`}
                  className="offb-table__content offb-table__content--allow-break"
                >
                  {value || '-'}
                </div>
              </td>
              <td>
                <TextField
                  name={`${name}[${index}]openForms.translations.${activeLanguage}.label`}
                  aria-label={intl.formatMessage(
                    {
                      description: 'Accessible label for option label translation field',
                      defaultMessage: 'Translation for option with value "{value}"',
                    },
                    {value: value}
                  )}
                />
              </td>
            </tr>
          </>
        ))}
      </tbody>

      {withOptionDescription && (
        <tbody>
          <tr>
            <th colSpan={3} style={{textAlign: 'end'}}>
              <FormattedMessage
                description="Values/options description translations table header"
                defaultMessage="Description translations"
              />
            </th>
          </tr>
          {options.map(({description, value}, index) => (
            <tr key={`option-description-${index}`}>
              <td>
                <span id={`option-${index}-label`}>
                  <FormattedMessage
                    description="Label for option description location"
                    defaultMessage="Option description (<option></option>)"
                    values={{
                      option: () => (
                        <code className="offb-table__content offb-table__content--allow-break">
                          {value || '-'}
                        </code>
                      ),
                    }}
                  />
                </span>
              </td>

              <td>
                <div
                  aria-describedby={`option-${index}-label`}
                  className="offb-table__content offb-table__content--allow-break"
                >
                  {description || '-'}
                </div>
              </td>

              <td>
                <TextArea
                  name={`${name}[${index}]openForms.translations.${activeLanguage}.description`}
                  aria-labelledby={`option-${index}-label`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </>
  );
}

export default ValuesTranslations;
