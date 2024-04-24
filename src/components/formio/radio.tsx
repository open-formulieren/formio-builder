import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs';
import {ReactNode} from 'react';
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
  label: ReactNode;
  description?: string;
}

export interface RadioProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  required?: boolean;
  isPreview?: boolean;
  tooltip?: string;
  description?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  required = false,
  isPreview = false,
  tooltip = '',
  description = '',
}) => {
  const {values, setValues} = useFormikContext<ExtendedComponentSchema>();

  const clearRadioValues = () => {
    const updatedValues = {...values};
    updatedValues[name] = '';
    setValues(updatedValues);
  };

  return (
    <Component type="radio" field={name} label={label} tooltip={tooltip} required={required}>
      {values[name] && !isPreview && (
        <div>
          <button
            type="button"
            className="btn btn-secondary formio-button-remove-row"
            onClick={clearRadioValues}
          >
            <i className="fa fa-times-circle" aria-hidden="true" />
            <FormattedMessage
              description="Clear radio values button label"
              defaultMessage="Clear radio button values"
            />
          </button>
        </div>
      )}

      <div className="form-radio radio">
        {options.map(({value, label, description}, index) => (
          <div key={`option-${value}-${index}`} className="form-check">
            <label className="form-check-label">
              <RadioInput name={name} value={value} label={label} description={description} />
            </label>
          </div>
        ))}
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Radio;
