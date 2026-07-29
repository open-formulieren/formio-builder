import {clsx} from 'clsx';
import {Field, useFormikContext} from 'formik';
import {useContext, useLayoutEffect, useRef, useState} from 'react';

import {RenderContext} from '@/context';
import CharCount from '@/utils/charcount';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import {withMultiple} from './multiple';

export interface TextAreaProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: React.ReactNode;
  showCharCount?: boolean;
  autoExpand?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextArea: React.FC<JSX.IntrinsicElements['textarea'] & TextAreaProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  showCharCount = false,
  autoExpand = false,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const {getFieldProps, getFieldMeta} = useFormikContext();
  const {
    value,
    onChange: formikOnChange,
    onBlur: formikOnBlur,
  } = getFieldProps<string | undefined>(name);
  const {touched} = getFieldMeta<string | undefined>(name);
  const {errors, hasErrors} = useValidationErrors(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const {bareInput} = useContext(RenderContext);
  const [hasFocus, setHasFocus] = useState(false);

  useLayoutEffect(() => {
    const node = inputRef.current;
    if (autoExpand && node) {
      const computedStyle = window.getComputedStyle(node);
      node.style.height = 'inherit';
      node.style.height = `calc(${node.scrollHeight}px + ${computedStyle.borderTopWidth} + ${computedStyle.borderBottomWidth})`;
    }
  }, [autoExpand, inputRef, value]);

  const htmlId = `editform-${name}`;
  if (value === undefined && props.value === undefined) {
    props = {...props, value: ''};
  }

  const inputField = (
    <Field
      innerRef={inputRef}
      name={name}
      id={htmlId}
      as="textarea"
      type="textarea"
      className={clsx('form-control', {'is-invalid': hasErrors})}
      data-testid={`input-${name}`}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        formikOnChange(event);
        onChange?.(event);
      }}
      onFocus={(event: React.FocusEvent<HTMLTextAreaElement>) => {
        setHasFocus(true);
        onFocus?.(event);
      }}
      onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => {
        formikOnBlur(event);
        setHasFocus(false);
        onBlur?.(event);
      }}
      {...props}
    />
  );

  const charCount = showCharCount && (touched || hasFocus) && value && <CharCount value={value} />;

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
      type="textarea"
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

// make the TextArea component 'multiple' capable
export const TextAreaMultiple = withMultiple(TextArea, '');
export default TextAreaMultiple;
