import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {useContext} from 'react';

import {RenderContext} from '@/context';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface DateTimeFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
}

// See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
export const DateTimeField: React.FC<JSX.IntrinsicElements['input'] & DateTimeFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  ...props
}) => {
  const {getFieldProps} = useFormikContext();
  const {bareInput} = useContext(RenderContext);
  const {errors, hasErrors} = useValidationErrors(name);

  const htmlId = `editform-${name}`;

  const {value} = getFieldProps<string | undefined | null>(name);

  // let's not bother with date pickers - use the native browser date input instead.
  const inputField = (
    <Field
      name={name}
      id={htmlId}
      as="input"
      type="datetime-local"
      className={clsx('form-control', {'is-invalid': hasErrors})}
      data-testid={`input-${name}`}
      // text fallback - use ISO-8601
      pattern="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}"
      value={value ?? ''}
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
      type="datetime"
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

export const DateTimeFieldMultiple = withMultiple(DateTimeField, '');
export default DateTimeFieldMultiple;
