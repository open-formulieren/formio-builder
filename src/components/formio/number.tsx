import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {ChangeEvent} from 'react';

import {useValidationErrors} from '@/utils/errors';

import Affix from './affix';
import Component from './component';
import Description from './description';

export interface NumberProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}

// Preferably we'd use null instead of undefined (the latter does not get JSON serialized),
// but form.io's schema's typically don't account for null.
type NumberFieldValue = number | undefined;

export const NumberField: React.FC<JSX.IntrinsicElements['input'] & NumberProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  prefix = '',
  suffix = '',
  ...props
}) => {
  const {getFieldProps, getFieldHelpers} = useFormikContext<unknown>();
  const {hasErrors} = useValidationErrors(name);

  // ensure that the empty string is normalized to 'undefined' for number fields.
  const {value, onChange: formikOnChange} = getFieldProps<NumberFieldValue>(name);
  const {setValue} = getFieldHelpers<NumberFieldValue>(name);

  const htmlId = `editform-${name}`;

  return (
    <Component
      type="number"
      field={name}
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
    >
      <div>
        <Wrapper suffix={suffix} prefix={prefix}>
          <Field
            name={name}
            id={htmlId}
            as="input"
            type="number"
            className={clsx('form-control', {'is-invalid': hasErrors})}
            data-testid={`input-${name}`}
            {...props}
            value={value ?? ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const {value} = event.target;
              formikOnChange(event);
              // normalize to be *not* a string in the state. React & browsers follow the
              // HTML which states that the value must be an empty string for empty inputs,
              // even if it's a number input.
              if (value === '') {
                setValue(undefined);
              }
            }}
          />
        </Wrapper>
      </div>
      {description && <Description text={description} />}
    </Component>
  );
};

interface WrapperProps {
  prefix?: string;
  suffix?: string;
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({prefix, suffix, children}) => {
  if (!(prefix || suffix)) return <>{children}</>;
  return (
    <div className="input-group">
      {prefix && (
        <div className="input-group-append">
          <Affix className="input-group-text">{prefix}</Affix>
        </div>
      )}
      {children}
      {suffix && (
        <div className="input-group-append">
          <Affix className="input-group-text">{suffix}</Affix>
        </div>
      )}
    </div>
  );
};

export default NumberField;
