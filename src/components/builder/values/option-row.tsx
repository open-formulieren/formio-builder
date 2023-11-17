import {css} from '@emotion/css';
import {Option} from '@open-formulieren/types/lib/formio/common';
import {FieldArrayRenderProps, useFormikContext} from 'formik';
import camelCase from 'lodash.camelcase';
import {useIntl} from 'react-intl';

import {TextField} from '@/components/formio';

const ICONS_CELL = css`
  vertical-align: middle !important;
`;

const SORT_ICONS = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: center;

  button {
    all: unset;
    padding-inline: 0.2em;
    line-height: 0;

    :not(:disabled) {
      cursor: pointer;
    }

    :disabled {
      color: #999;
    }

    :focus-visible .fa {
      // bootstrap focus styles
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`;

export interface OptionRowProps {
  name: string;
  index: number;
  arrayHelpers: FieldArrayRenderProps;
}

const OptionRow: React.FC<OptionRowProps> = ({name, index, arrayHelpers}) => {
  const intl = useIntl();
  const fieldNamePrefix = `${name}[${index}]`;
  const {getFieldProps, getFieldHelpers} = useFormikContext();
  const numOptions = getFieldProps<Option[]>(name).value?.length || 0;

  const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value: option} = getFieldProps<Option>(fieldNamePrefix);
    const oldDerivedValue = camelCase(option.label);
    // do nothing if an option value is set and the value is different from the
    // label-derived value.
    if (option.value && option.value != oldDerivedValue) return;
    const derivedValue = camelCase(event.target.value);
    const {setValue} = getFieldHelpers<Option['value']>(`${fieldNamePrefix}.value`);
    setValue(derivedValue);
  };

  return (
    <>
      <td className={ICONS_CELL}>
        <div className={SORT_ICONS}>
          <button
            type="button"
            aria-label={intl.formatMessage({
              description: 'Options table: move option up',
              defaultMessage: 'Move up',
            })}
            onClick={() => arrayHelpers.move(index, index - 1)}
            disabled={index === 0}
          >
            <i className="fa fa-chevron-up" />
          </button>
          <button
            type="button"
            aria-label={intl.formatMessage({
              description: 'Options table: move option down',
              defaultMessage: 'Move down',
            })}
            onClick={() => arrayHelpers.move(index, index + 1)}
            disabled={index === numOptions - 1}
          >
            <i className="fa fa-chevron-down" />
          </button>
        </div>
      </td>

      <td>
        <TextField
          name={`${fieldNamePrefix}.label`}
          aria-label={intl.formatMessage({
            description: 'Accessible label for option label',
            defaultMessage: 'Option label',
          })}
          onChange={onLabelChange}
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
          // TODO: in new design -> implement this in a proper accessible way
          disabled={numOptions <= 1}
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
