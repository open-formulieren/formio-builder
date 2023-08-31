import clsx from 'clsx';
import {Field} from 'formik';
import {useContext} from 'react';

import {RenderContext} from '@/context';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface DateFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
}

export const DateField: React.FC<JSX.IntrinsicElements['input'] & DateFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  ...props
}) => {
  const {bareInput} = useContext(RenderContext);
  const {errors, hasErrors} = useValidationErrors(name);

  const htmlId = `editform-${name}`;

  // let's not bother with date pickers - use the native browser date input instead.
  const inputField = (
    <Field
      name={name}
      id={htmlId}
      as="input"
      type="date"
      className={clsx('form-control', {'is-invalid': hasErrors})}
      data-testid={`input-${name}`}
      // text fallback - use ISO-8601
      pattern="\d{4}-\d{2}-\d{2}"
      {...props}
    />
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
      type="date"
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

export const DateFieldMultiple = withMultiple(DateField, '');
export default DateFieldMultiple;
