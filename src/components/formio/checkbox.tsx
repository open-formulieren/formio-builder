import {Field} from 'formik';

import Component from './component';
import Tooltip from './tooltip';

export interface CheckboxProps {
  name: string;
  label?: React.ReactNode;
  tooltip?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({name, label, tooltip = ''}) => {
  return (
    <Component type="checkbox">
      <div className="form-check checkbox">
        <label className="form-check-label">
          <Field name={name} as="input" type="checkbox" className="form-check-input" />
          <span>{label}</span>
          {tooltip && ' '}
          <Tooltip text={tooltip} />
        </label>
      </div>
    </Component>
  );
};

export default Checkbox;
