import clsx from 'clsx';
import {Field, useField} from 'formik';

import Component from './component';
import Tooltip from './tooltip';

export interface CheckboxProps {
  name: string;
  label?: React.ReactNode;
  tooltip?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({name, label, tooltip = ''}) => {
  const [, {error}] = useField(name);
  const errors = error ? [error] : [];
  return (
    <Component type="checkbox" errors={errors}>
      <div className="form-check checkbox">
        <label className="form-check-label">
          <Field
            name={name}
            as="input"
            type="checkbox"
            className={clsx('form-check-input', {'is-invalid': errors.length})}
          />
          <span>{label}</span>
          {tooltip && ' '}
          <Tooltip text={tooltip} />
        </label>
      </div>
    </Component>
  );
};

export default Checkbox;
