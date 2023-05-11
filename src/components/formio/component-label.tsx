import clsx from 'clsx';
import React from 'react';

import Tooltip from './tooltip';

export interface ComponentLabelProps {
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: string;
  htmlId?: string;
}

const ComponentLabel: React.FC<ComponentLabelProps> = ({label, required, tooltip = '', htmlId}) => {
  const labelClassName = clsx('col-form-label', {'field-required': required});
  return (
    <label htmlFor={htmlId} className={labelClassName}>
      {label}
      {tooltip && ' '}
      <Tooltip text={tooltip} />
    </label>
  );
};

export default ComponentLabel;
