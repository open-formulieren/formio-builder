import {Option} from '@open-formulieren/types/lib/formio/common';
import {FieldArray, useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {Component} from '@/components/formio';
import {PathsForValueType} from '@/types';

import OptionRow from './option-row';

export interface ValuesTableProps<S> {
  /**
   * Name of the field holding the (component) values, e.g. `values` or `data.values`.
   */
  name: PathsForValueType<S, Option[]> & string;
}

/**
 * Manage a set of option values/labels for a component.
 *
 * Formio typically allows you to specify manual options/values for preset options,
 * like the dropdown for a select, the values + labels for a radio choice or multiple
 * checkboxes.
 *
 * This component is a generic component, you must use it by passing the relevant
 * concrete schema for `name` prop autocomplete and type checking, e.g.:
 *
 *
 *     <ValuesTable<SelectComponentSchema> name="data.values" />
 *
 * Translations for every option label are (to be) managed in a dedicated translations
 * component.
 */
function ValuesTable<S>({name}: ValuesTableProps<S>) {
  const intl = useIntl();
  const {getFieldProps} = useFormikContext();
  const {value: options = []} = getFieldProps<Option[] | undefined>(name);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'values' builder field",
    defaultMessage: `The values that can be picked for this field. Values are the text
    that is submitted with the form data. Labels are the text next to radio buttons,
    checkboxes and options in dropdowns.
    `,
  });

  return (
    <Component
      type="datagrid"
      label={
        <FormattedMessage
          description="Label for the 'values' builder field"
          defaultMessage="Values"
        />
      }
      tooltip={tooltip}
    >
      <FieldArray name={name}>
        {arrayHelpers => (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th />

                <th className="field-required">
                  <FormattedMessage
                    description="Option label table header/label"
                    defaultMessage="Label"
                  />
                </th>

                <th className="field-required">
                  <FormattedMessage
                    description="Option value table header/label"
                    defaultMessage="Value"
                  />
                </th>

                <th>
                  <span className="sr-only">
                    <FormattedMessage
                      description="Option add/remove table header/label"
                      defaultMessage="Add/remove"
                    />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {options.map((_, index) => (
                <tr key={index}>
                  <OptionRow name={name} index={index} arrayHelpers={arrayHelpers} />
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={4}>
                  <button
                    type="button"
                    className="btn btn-primary formio-button-add-row"
                    onClick={() =>
                      arrayHelpers.push({
                        value: '',
                        label: '',
                        openForms: {translations: {}},
                      } satisfies Option)
                    }
                  >
                    <i className="fa fa-plus" aria-hidden="true" />
                    <FormattedMessage
                      description="Add another option button label"
                      defaultMessage="Add another"
                    />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </FieldArray>
    </Component>
  );
}

export default ValuesTable;
