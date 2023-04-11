import {Field} from 'formik';

import Component from './component';

export interface TextFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  tooltip?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  ...props
}) => {
  const htmlId = `editform-${name}`;
  return (
    <Component type="textfield" required={required} htmlId={htmlId} label={label} tooltip={tooltip}>
      <div>
        <Field name={name} id={htmlId} as="input" type="text" className="form-control" {...props} />
      </div>
    </Component>
  );
};

export default TextField;
