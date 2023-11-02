import {FieldArrayRenderProps} from 'formik';
import {useIntl} from 'react-intl';

import {TextField} from '@/components/formio';

export interface OptionRowProps {
  name: string;
  index: number;
  arrayHelpers: FieldArrayRenderProps;
}

const OptionRow: React.FC<OptionRowProps> = ({name, index, arrayHelpers}) => {
  const intl = useIntl();
  const fieldNamePrefix = `${name}[${index}]`;
  return (
    <>
      <td>
        {/* TODO: minimum viable would be icons to move row up/down, d&d is too much work */}
        <button
          className="formio-drag-button btn btn-default fa fa-bars"
          type="button"
          aria-label={intl.formatMessage({
            description: 'Options table: drag and drop button for single option row',
            defaultMessage: 'Reorder option',
          })}
          onMouseDown={() => alert('drag & drop not implemented yet')}
        />
      </td>

      <td>
        <TextField
          name={`${fieldNamePrefix}.label`}
          aria-label={intl.formatMessage({
            description: 'Accessible label for option label',
            defaultMessage: 'Option label',
          })}
        />
      </td>

      <td>
        <TextField
          name={`${fieldNamePrefix}.value`}
          aria-label={intl.formatMessage({
            description: 'Accessible label for option value',
            defaultMessage: 'Option value',
          })}
        />
      </td>

      <td>
        <button
          type="button"
          className="btn btn-secondary formio-button-remove-row"
          tabIndex={0}
          aria-label={intl.formatMessage({
            description: 'Values table: accessible label to remove an option',
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

export default OptionRow;
