import {Option} from '@open-formulieren/types/lib/formio/common';
import {FieldArray, useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {Component} from '@/components/formio';

import OptionRow from './OptionRow';

export interface ValuesTableProps {
  /**
   * Name of the field holding the (component) values, e.g. `values` or `data.values`.
   */
  name: string;
}

/**
 * Manage a set of option values/labels for a component.
 *
 * @todo - automatically set option value from label unless explicitly provided.
 */
const ValuesTable: React.FC<ValuesTableProps> = ({name}) => {
  const {getFieldProps} = useFormikContext();
  const {value: options = []} = getFieldProps<Option[] | undefined>(name);

  return (
    <Component type="datagrid">
      <FieldArray name={name}>
        {arrayHelpers => (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th />

                <th>
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
};

export default ValuesTable;
