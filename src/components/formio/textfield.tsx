import clsx from 'clsx';
import {Field, useField} from 'formik';
import {FormattedMessage} from 'react-intl';

import {useValidationErrors} from '@utils/errors';

import Component from './component';
import Description from './description';

export interface TextFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
  showCharCount?: boolean;
}

const TextField: React.FC<JSX.IntrinsicElements['input'] & TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  showCharCount = false,
  ...props
}) => {
  const {hasErrors} = useValidationErrors(name);
  const [{value}, {touched}] = useField<string | undefined>(name);
  const htmlId = `editform-${name}`;
  if (value === undefined && props.value === undefined) {
    props = {...props, value: ''};
  }
  return (
    <Component
      type="textfield"
      field={name}
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
    >
      <div>
        <Field
          name={name}
          id={htmlId}
          as="input"
          type="text"
          className={clsx('form-control', {'is-invalid': hasErrors})}
          {...props}
        />
      </div>
      {showCharCount && touched && value && (
        <span className="text-muted">
          <FormattedMessage
            description="Character count"
            defaultMessage="{length} {length, plural, one {character} other {characters}}"
            values={{length: (value || '').length}}
          />
        </span>
      )}
      {description && <Description text={description} />}
    </Component>
  );
};

export default TextField;
