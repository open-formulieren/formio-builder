import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {useContext, useRef} from 'react';

import {RenderContext} from '@/context';
import CharCount from '@/utils/charcount';
import {ErrorList, useValidationErrors} from '@/utils/errors';
import {applyInputMask} from '@/utils/inputmask';

import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface TextFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: React.ReactNode;
  showCharCount?: boolean;
  inputMask?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField: React.FC<JSX.IntrinsicElements['input'] & TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  showCharCount = false,
  inputMask,
  onChange,
  ...props
}) => {
  const {getFieldProps, getFieldMeta} = useFormikContext();
  const {value, onChange: formikOnChange} = getFieldProps<string | undefined>(name);
  const {touched} = getFieldMeta<string | undefined>(name);
  const {errors, hasErrors} = useValidationErrors(name);
  // const [{value}, {touched}] = useField<string | undefined>(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const {bareInput} = useContext(RenderContext);

  const htmlId = `editform-${name}`;
  if (value === undefined && props.value === undefined) {
    props = {...props, value: ''};
  }

  // XXX: this is only accepted in the form builder to get to (close to) vanilla form
  // builder feature parity - setting the value with mask placeholders is bad for
  // accessibility.
  //
  // It also turns out to be too much effort to get the masking working for preview
  // purposes, so that is deliberately "not working".
  if (!props.value && inputMask && !props.placeholder) {
    props.placeholder = applyInputMask('', inputMask);
  }

  const inputField = (
    <Field
      innerRef={inputRef}
      name={name}
      id={htmlId}
      as="input"
      type="text"
      className={clsx('form-control', {'is-invalid': hasErrors})}
      data-testid={`input-${name}`}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        formikOnChange(event);
        onChange?.(event);
      }}
      {...props}
    />
  );

  const hasFocus = inputRef.current === document.activeElement;
  const charCount = showCharCount && (touched || hasFocus) && value && (
    <CharCount value={value} maxLength={props.maxLength} />
  );

  // 'bare input' is actually a little bit more than just the input, looking at the
  // vanillay formio implementation.
  if (bareInput) {
    return (
      <>
        {inputField}
        {charCount}
        <ErrorList errors={errors} />
      </>
    );
  }

  // default-mode, wrapping the field with label, description etc.
  return (
    <Component
      type="textfield"
      field={name}
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
    >
      <div>{inputField}</div>
      {charCount}
      {description && <Description text={description} />}
    </Component>
  );
};

// make the TextField component 'multiple' capable
export const TextFieldMultiple = withMultiple(TextField, '');
export default TextFieldMultiple;
