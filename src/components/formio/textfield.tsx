import type {FAQItem as FAQItemType} from '@open-formulieren/types';
import {clsx} from 'clsx';
import {Field, useFormikContext} from 'formik';
import {useContext, useState} from 'react';

import {RenderContext} from '@/context';
import CharCount from '@/utils/charcount';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import Component from './component';
import Description from './description';
import {FAQItems} from './faq-items';
import {withMultiple} from './multiple';

export interface TextFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: React.ReactNode;
  faqItems?: FAQItemType[];
  description?: React.ReactNode;
  showCharCount?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  childrenAfterField?: React.ReactNode;
}

export const TextField: React.FC<JSX.IntrinsicElements['input'] & TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  faqItems = [],
  description = '',
  showCharCount = false,
  onChange,
  childrenAfterField,
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
  const {bareInput} = useContext(RenderContext);
  const [hasFocus, setHasFocus] = useState(false);

  const htmlId = `editform-${name}`;
  if (value === undefined && props.value === undefined) {
    props = {...props, value: ''};
  }

  const inputField = (
    <>
      <Field
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
        onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
          setHasFocus(true);
          onFocus?.(event);
        }}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
          formikOnBlur(event);
          setHasFocus(false);
          onBlur?.(event);
        }}
        {...props}
      />
      {childrenAfterField}
    </>
  );

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
      <FAQItems items={faqItems} />
    </Component>
  );
};

// make the TextField component 'multiple' capable
export const TextFieldMultiple = withMultiple(TextField, '');
export default TextFieldMultiple;
