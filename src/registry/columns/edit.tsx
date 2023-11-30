import {Column, ColumnsComponentSchema} from '@open-formulieren/types';
import {FieldArray, FieldArrayRenderProps, useFormikContext} from 'formik';
import {useContext, useRef} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {ClearOnHide, Hidden, Key} from '@/components/builder';
import {Component, NumberField} from '@/components/formio';
import {BuilderContext} from '@/context';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'columns' type component.
 */
const EditForm: EditFormDefinition<ColumnsComponentSchema> = () => {
  const {uniquifyKey} = useContext(BuilderContext);
  const isKeyManuallySetRef = useRef(false);
  const {values} = useFormikContext<ColumnsComponentSchema>();
  const generatedKey = uniquifyKey(values.key);
  return (
    <div className="card">
      <div className="card-body">
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Hidden />
        <ClearOnHide />
        <Columns />
      </div>
    </div>
  );
};

EditForm.defaultValues = {
  key: '',
  hidden: false,
  clearOnHide: true,
  columns: [
    {
      size: 6,
      sizeMobile: 4,
      components: [],
    },
    {
      size: 6,
      sizeMobile: 4,
      components: [],
    },
  ],
};

interface ColumnProps {
  index: number;
  arrayHelpers: FieldArrayRenderProps;
}

const ColumnRow: React.FC<ColumnProps> = ({index, arrayHelpers}) => {
  const intl = useIntl();
  const {getFieldProps} = useFormikContext();
  const numCols = getFieldProps<Column[]>('columns').value?.length || 0;
  return (
    <>
      <td>
        <NumberField
          name={`columns.${index}.size`}
          aria-label={intl.formatMessage({
            description: 'Accessible label for column size',
            defaultMessage: 'Column size, value between 1 and 12.',
          })}
        />
      </td>
      <td>
        <NumberField
          name={`columns.${index}.sizeMobile`}
          aria-label={intl.formatMessage({
            description: 'Accessible label for column mobile size',
            defaultMessage: 'Column size on mobile, value between 1 and 4.',
          })}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-secondary formio-button-remove-row"
          // TODO: in new design -> implement this in a proper accessible way
          disabled={numCols <= 1}
          aria-label={intl.formatMessage({
            description: 'Columns table: accessible label to remove a column',
            defaultMessage: 'Remove',
          })}
          onClick={() => arrayHelpers.remove(index)}
        >
          <i className="fa fa-times-circle-o" />
        </button>
      </td>
    </>
  );
};

const Columns: React.FC = () => {
  const intl = useIntl();
  const {getFieldProps} = useFormikContext();
  const {value: columns = []} = getFieldProps<Column[] | undefined>('columns');

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'columns' builder field",
    defaultMessage: 'Specify the size of each column. The sum of all the widths should be 100%.',
  });
  return (
    <Component
      type="datagrid"
      label={
        <FormattedMessage
          description="Label for the 'columns' builder field"
          defaultMessage="Column sizes"
        />
      }
      tooltip={tooltip}
    >
      <FieldArray name="columns">
        {arrayHelpers => (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="field-required">
                  <FormattedMessage
                    description="Column size table header/label"
                    defaultMessage="Size"
                  />
                </th>

                <th className="field-required">
                  <FormattedMessage
                    description="Column mobile size table header/label"
                    defaultMessage="Size (mobile)"
                  />
                </th>

                <th>
                  <span className="sr-only">
                    <FormattedMessage
                      description="Column add/remove table header/label"
                      defaultMessage="Add/remove"
                    />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {columns.map((_, index) => (
                <tr key={index}>
                  <ColumnRow index={index} arrayHelpers={arrayHelpers} />
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={3}>
                  <button
                    type="button"
                    className="btn btn-primary formio-button-add-row"
                    onClick={() =>
                      arrayHelpers.push({
                        size: 6,
                        sizeMobile: 4,
                        components: [],
                      } satisfies Column)
                    }
                  >
                    <i className="fa fa-plus" aria-hidden="true" />
                    <FormattedMessage
                      description="Add another column button label"
                      defaultMessage="Add column"
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

export default EditForm;
