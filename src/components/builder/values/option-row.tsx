import {css} from '@emotion/css';
import {Option} from '@open-formulieren/types/lib/formio/common';
import {FieldArrayRenderProps, useFormikContext} from 'formik';
import camelCase from 'lodash.camelcase';
import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {TextField} from '@/components/formio';
import ComponentLabel from '@/components/formio/component-label';
import {TextArea} from '@/components/formio/textarea';

const ICONS_CELL = css`
  vertical-align: middle !important;
  border-bottom: none !important;
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
  withOptionDescription?: boolean;
}

const OptionRow: React.FC<OptionRowProps> = ({
  name,
  index,
  arrayHelpers,
  withOptionDescription = false,
}) => {
  const intl = useIntl();
  const fieldNamePrefix = `${name}[${index}]`;
  const {getFieldProps, getFieldHelpers} = useFormikContext();
  const numOptions = getFieldProps<Option[]>(name).value?.length || 0;
  const [showDescription, setShowDescription] = useState(false);

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

  const description = getFieldProps<Option>(fieldNamePrefix).value.description ?? '';
  return (
    <>
      <tr>
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

        <td style={{borderBottom: 'none'}}>
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
      </tr>

      {withOptionDescription && (
        <tr>
          <th style={{borderTop: 'none'}} />
          <td colSpan={2}>
            {showDescription ? (
              <>
                <ComponentLabel
                  label={
                    <>
                      <FormattedMessage
                        description="Option/choice extra description label"
                        defaultMessage="Description"
                      />
                    </>
                  }
                  noColFormLabelClassname
                  htmlId={`${fieldNamePrefix}.description`}
                  tooltip={intl.formatMessage({
                    description: 'Tooltip for option/choice description',
                    defaultMessage:
                      'Optionally provide additional information to explain the meaning of the option.',
                  })}
                />
                &nbsp;
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setShowDescription(false);
                  }}
                >
                  <FormattedMessage
                    description="Link to collapse/hide option description."
                    defaultMessage="(collapse)"
                  />
                </a>
                <TextArea name={`${fieldNamePrefix}.description`} />
              </>
            ) : (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setShowDescription(true);
                }}
              >
                <FormattedMessage
                  description="Link to expand/show the option description textarea."
                  defaultMessage="{hasDescription, select, true {Edit description} other {Add description}}"
                  values={{
                    hasDescription: !!description,
                  }}
                />
              </a>
            )}
          </td>
          <td style={{borderTop: 'none'}} />
        </tr>
      )}
    </>
  );
};

export default OptionRow;
