import clsx from 'clsx';
import {Field} from 'formik';
import {ReactNode} from 'react';

import {useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';

export interface RadioInputProps {
  name: string;
  value: string;
  label?: React.ReactNode;
}

export const RadioInput: React.FC<RadioInputProps> = ({name, value, label}) => {
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
    </>
  );
};

export interface Option {
  value: string;
  label: ReactNode;
}

export interface RadioProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  required = false,
  tooltip = '',
  description = '',
}) => {
  return (
    <Component type="radio" field={name} label={label} tooltip={tooltip} required={required}>
      <div className="form-radio radio">
        {options.map(({value, label}, index) => (
          <div key={`option-${value}-${index}`} className="form-check">
            <label className="form-check-label">
              <RadioInput name={name} value={value} label={label} />
            </label>
          </div>
        ))}
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Radio;
