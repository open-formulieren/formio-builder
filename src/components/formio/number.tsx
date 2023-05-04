import clsx from 'clsx';
import {Field} from 'formik';

import {useValidationErrors} from '@/utils/errors';

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
  const {hasErrors} = useValidationErrors(name);
  const htmlId = `editform-${name}`;
  return (
    <Component
      type="number"
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
          type="number"
          className={clsx('form-control', {'is-invalid': hasErrors})}
          {...props}
        />
      </div>
    </Component>
  );
};

export default NumberField;
