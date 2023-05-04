import clsx from 'clsx';
import {Field} from 'formik';

import {useValidationErrors} from '@utils/errors';

import Component from './component';
import Tooltip from './tooltip';

export interface CheckboxProps {
  name: string;
  label?: React.ReactNode;
  tooltip?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({name, label, tooltip = ''}) => {
  const {hasErrors} = useValidationErrors(name);
  return (
    <Component field={name} type="checkbox">
      <div className="form-check checkbox">
        <label className="form-check-label">
          <Field
            name={name}
            as="input"
            type="checkbox"
            className={clsx('form-check-input', {'is-invalid': hasErrors})}
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
