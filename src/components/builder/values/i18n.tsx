import {Option} from '@open-formulieren/types/lib/formio/common';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {useIntl} from 'react-intl';

import {TextField} from '@/components/formio';
import {PathsForValueType} from '@/types';

import {ComponentTranslationsContext} from '../i18n';

export interface ValuesTranslationsProps<S> {
  /**
   * Name of the field holding the (component) values, e.g. `values` or `data.values`.
   */
  name: PathsForValueType<S, Option[]> & string;
}

/**
 * Manage the values/options translations for a component.
 *
 * This component is intended to be passed as a child component to
 * `ComponentTranslations` so that all translations are managed in a single
 * tab.
 */
function ValuesTranslations<S>({name}: ValuesTranslationsProps<S>) {
  const intl = useIntl();
  const {activeLanguage} = useContext(ComponentTranslationsContext);
  const {getFieldProps} = useFormikContext<S>();
  const {value: options = []} = getFieldProps<Option[] | undefined>(name);
  return (
    // Same markup as ComponentTranslations<S> body
    <tbody>
      {options.map(({value, label}, index) => (
        <tr key={`option-${index}`}>
          <td>
            <span id={`option-${index}-label`}>{label}</span>
          </td>
          <td>
            <div aria-describedby={`option-${index}-label`}>{value || '-'}</div>
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
      ))}
    </tbody>
  );
}

export default ValuesTranslations;
