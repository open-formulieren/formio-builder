import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import {useContext, useRef} from 'react';

import {RenderContext} from '@/context';
import CharCount from '@/utils/charcount';
import {useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface TextFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
  showCharCount?: boolean;
}

export const TextField: React.FC<JSX.IntrinsicElements['input'] & TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  showCharCount = false,
  ...props
}) => {
  const {getFieldProps, getFieldMeta} = useFormikContext();
  const {value} = getFieldProps<string | undefined>(name);
  const {touched} = getFieldMeta<string | undefined>(name);
  const {hasErrors} = useValidationErrors(name);
  // const [{value}, {touched}] = useField<string | undefined>(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const {bareInput} = useContext(RenderContext);

  const htmlId = `editform-${name}`;
  if (value === undefined && props.value === undefined) {
    props = {...props, value: ''};
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
      {...props}
    />
  );

  const hasFocus = inputRef.current === document.activeElement;
  const charCount = showCharCount && (touched || hasFocus) && value && <CharCount value={value} />;

  // 'bare input' is actually a little bit more than just the input, looking at the
  // vanillay formio implementation.
  if (bareInput) {
    return (
      <>
        {inputField}
        {charCount}
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
