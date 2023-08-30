import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {ChangeEvent, useContext} from 'react';

import {RenderContext} from '@/context';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import Affix from './affix';
import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface NumberProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
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
  suffix = '',
  ...props
}) => {
  const {getFieldProps, getFieldHelpers} = useFormikContext<unknown>();
  const {errors, hasErrors} = useValidationErrors(name);
  const {bareInput} = useContext(RenderContext);

  // ensure that the empty string is normalized to 'undefined' for number fields.
  const {value, onChange: formikOnChange} = getFieldProps<NumberFieldValue>(name);
  const {setValue} = getFieldHelpers<NumberFieldValue>(name);

  const htmlId = `editform-${name}`;

  const inputField = (
    <Wrapper suffix={suffix}>
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
  );

  // 'bare input' is actually a little bit more than just the input, looking at the
  // vanillay formio implementation.
  if (bareInput) {
    return (
      <>
        {inputField}
        <ErrorList errors={errors} />
      </>
    );
  }

  // default-mode, wrapping the field with label, description etc.
  return (
    <Component
      type="number"
      field={name}
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
    >
      <div>{inputField}</div>
      {description && <Description text={description} />}
    </Component>
  );
};

interface WrapperProps {
  suffix: string;
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({suffix, children}) => {
  if (!suffix) return <>{children}</>;
  return (
    <div className="input-group">
      {children}
      <div className="input-group-append">
        <Affix className="input-group-text">{suffix}</Affix>
      </div>
    </div>
  );
};

// make the NumberField component 'multiple' capable
export const NumberFieldMultiple = withMultiple(NumberField, '');
export default NumberFieldMultiple;
