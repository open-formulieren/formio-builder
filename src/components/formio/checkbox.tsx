import clsx from 'clsx';
import {Field, FormikHandlers, useFormikContext} from 'formik';

import {useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import Tooltip from './tooltip';

export interface CheckboxInputProps {
  name: string;
  label?: React.ReactNode;
  onChange?: FormikHandlers['handleChange'];
  optionDescription?: string;
  disabled?: boolean;
  checked?: boolean;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  onChange,
  optionDescription,
  disabled = false,
  checked = undefined,
}) => {
  const {getFieldProps} = useFormikContext();
  const {value, onChange: formikOnChange} = getFieldProps(name);
  const {hasErrors} = useValidationErrors(name);
  return (
    <>
      <Field
        name={name}
        as="input"
        type="checkbox"
        className={clsx('form-check-input', {'is-invalid': hasErrors})}
        onChange={(e: React.ChangeEvent<any>) => {
          formikOnChange(e);
          onChange?.(e);
        }}
        disabled={disabled}
        checked={checked ?? value}
      />
      <span>{label}</span>
      {optionDescription && <Description text={optionDescription} />}
    </>
  );
};

export interface CheckboxProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
  onChange?: FormikHandlers['handleChange'];
  optionDescription?: string;
  disabled?: boolean;
  checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  onChange,
  optionDescription,
  disabled = false,
  checked = undefined,
}) => (
  <Component field={name} required={required} type="checkbox">
    <div className="form-check checkbox">
      <label className="form-check-label">
        <CheckboxInput
          name={name}
          label={label}
          onChange={onChange}
          optionDescription={optionDescription}
          disabled={disabled}
          checked={checked}
        />
        {tooltip && ' '}
        <Tooltip text={tooltip} />
      </label>
    </div>
    {description && <Description text={description} />}
  </Component>
);
export default Checkbox;
