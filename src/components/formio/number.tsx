import clsx from 'clsx';
import {Field} from 'formik';
import {useContext} from 'react';

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

export const NumberField: React.FC<JSX.IntrinsicElements['input'] & NumberProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  suffix = '',
  ...props
}) => {
  const {errors, hasErrors} = useValidationErrors(name);
  const {bareInput} = useContext(RenderContext);

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
