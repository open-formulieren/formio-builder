import {Field} from 'formik';

import Component from './component';
import Description from './description';

export interface TextFieldProps {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
}

const TextField: React.FC<JSX.IntrinsicElements['input'] & TextFieldProps> = ({
  name,
  label,
  required = false,
  tooltip = '',
  description = '',
  ...props
}) => {
  const htmlId = `editform-${name}`;
  return (
    <Component type="textfield" required={required} htmlId={htmlId} label={label} tooltip={tooltip}>
      <div>
        <Field name={name} id={htmlId} as="input" type="text" className="form-control" {...props} />
      </div>
      {description && <Description text={description} />}
    </Component>
  );
};

export default TextField;
