import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs';
import {FormattedMessage} from 'react-intl';

import {useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';

export interface RadioInputProps {
  name: string;
  value: string;
  label?: React.ReactNode;
  description?: string;
}

export const RadioInput: React.FC<RadioInputProps> = ({name, value, label, description}) => {
  const {hasErrors} = useValidationErrors(name);
  return (
    <>
      <Field
        name={name}
        as="input"
        type="radio"
        value={value}
        className={clsx('form-check-input', {'is-invalid': hasErrors})}
      />
      <span>{label}</span>
      {description && <Description text={description} />}
    </>
  );
};

export interface Option {
  value: string;
  label: React.ReactNode;
  description?: string;
}

export interface RadioProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  required?: boolean;
  isClearable?: boolean;
  tooltip?: string;
  description?: string;
  isLoading?: boolean;
}

const EmptyLabel: React.FC = () => (
  <em>
    <FormattedMessage
      description="Fallback label for option with empty label"
      defaultMessage="(missing label)"
    />
  </em>
);

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  required = false,
  isClearable = false,
  tooltip = '',
  description = '',
  isLoading = false,
}) => {
  const {getFieldProps, setFieldValue} = useFormikContext<ExtendedComponentSchema>();
  const {value} = getFieldProps(name);
  const hasSelection = !!options.find(opt => opt.value === value);

  if (isLoading) {
    return (
      <FormattedMessage description="Text for loading values" defaultMessage="Loading values..." />
    );
  }

  return (
    <Component type="radio" field={name} label={label} tooltip={tooltip} required={required}>
      <div className="form-radio radio">
        {options.map(({value, label, description}, index) => (
          <div key={`option-${value}-${index}`} className="form-check">
            <label className="form-check-label">
              <RadioInput
                name={name}
                value={value}
                label={label || <EmptyLabel />}
                description={description}
              />
            </label>
          </div>
        ))}
      </div>

      {description && <Description text={description} />}

      {hasSelection && isClearable && (
        <button
          type="button"
          className="btn btn-link btn-sm"
          onClick={() => setFieldValue(name, undefined)}
          style={{padding: 0}}
        >
          <FormattedMessage
            description="Clear selection button label"
            defaultMessage="Clear selection"
          />
        </button>
      )}
    </Component>
  );
};

export default Radio;
