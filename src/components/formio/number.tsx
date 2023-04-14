import {Field} from 'formik';

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
  const htmlId = `editform-${name}`;
  return (
    <Component type="number" required={required} htmlId={htmlId} label={label} tooltip={tooltip}>
      <div>
        <Field
          name={name}
          id={htmlId}
          as="input"
          type="number"
          className="form-control"
          {...props}
        />
      </div>
    </Component>
  );
};

export default NumberField;
