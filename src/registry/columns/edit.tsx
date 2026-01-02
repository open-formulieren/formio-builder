import {ColumnsComponentSchema} from '@open-formulieren/types';
import {Column} from '@open-formulieren/types/dist/components/columns';
import {Field, FieldArray, FieldArrayRenderProps, useFormikContext} from 'formik';
import {useContext, useEffect, useRef, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {ClearOnHide, Hidden, Key} from '@/components/builder';
import {Component} from '@/components/formio';
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
  const {getFieldProps, setFieldError} = useFormikContext<ColumnsComponentSchema>();
  const numCols = getFieldProps<Column[]>('columns').value?.length || 0;

  const prefix = `columns.${index}`;
  const {value: column} = getFieldProps<Column>(prefix);

  return (
    <>
      <td style={{verticalAlign: 'middle'}}>
        <div style={{display: 'flex', gap: '1em'}}>
          <Field
            as="input"
            type="range"
            name={`${prefix}.size`}
            className="form-control-range"
            min={1}
            max={12}
            aria-label={intl.formatMessage({
              description: 'Accessible label for column size',
              defaultMessage: 'Column size, value between 1 and 12.',
            })}
          />
          <span style={{flexShrink: '0'}}>{column.size} / 12</span>
        </div>
      </td>
      <td style={{verticalAlign: 'middle'}}>
        <div style={{display: 'flex', gap: '1em'}}>
          <Field
            as="input"
            type="range"
            name={`${prefix}.sizeMobile`}
            className="form-control-range"
            min={1}
            max={4}
            aria-label={intl.formatMessage({
              description: 'Accessible label for column mobile size',
              defaultMessage: 'Column size on mobile, value between 1 and 4.',
            })}
          />
          <span style={{flexShrink: '0'}}>{column.sizeMobile} / 4</span>
        </div>
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
          onClick={() => {
            arrayHelpers.remove(index);
            // Reset possible array-level validation error, to work around the mangled
            // validation errors. This effectively masks the problem described in
            // https://github.com/jaredpalmer/formik/issues/3352, it does not *solve*
            // it. A fresh submit attempt will re-run validation.
            setFieldError('columns', undefined);
          }}
        >
          <i className="fa fa-times-circle-o" />
        </button>
      </td>
    </>
  );
};

const Columns: React.FC = () => {
  const intl = useIntl();
  const {getFieldProps, validateField} = useFormikContext();
  const {value: columns = []} = getFieldProps<Column[] | undefined>('columns');
  const [mustValidate, setMustValidate] = useState(false);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'columns' builder field",
    defaultMessage: 'Specify the size of each column. The sum of all the widths should be 100%.',
  });

  useEffect(() => {
    if (!mustValidate) return;
    validateField('columns');
    setMustValidate(false);
  }, [mustValidate, validateField]);

  return (
    <Component
      type="datagrid"
      field="columns"
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
                    onClick={() => {
                      arrayHelpers.push({
                        size: 6,
                        sizeMobile: 4,
                        components: [],
                      } satisfies Column);
                      setMustValidate(true);
                    }}
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
