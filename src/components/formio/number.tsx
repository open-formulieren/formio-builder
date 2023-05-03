import clsx from 'clsx';
import {Field, useField} from 'formik';

import Component from './component';

export interface NumberProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
}

const NumberField: React.FC<JSX.IntrinsicElements['input'] & NumberProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  ...props
}) => {
  const [, {error}] = useField(name);
  const errors = error ? [error] : [];
  const htmlId = `editform-${name}`;
  return (
    <Component
      type="number"
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
      errors={errors}
    >
      <div>
        <Field
          name={name}
          id={htmlId}
          as="input"
          type="number"
          className={clsx('form-control', {'is-invalid': errors.length})}
          {...props}
        />
      </div>
    </Component>
  );
};

export default NumberField;
