import clsx from 'clsx';
import React from 'react';

import Tooltip from './tooltip';

export interface ComponentLabelProps {
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
  htmlId?: string;
  noColFormLabelClassname?: boolean;
}

const ComponentLabel: React.FC<ComponentLabelProps> = ({
  label,
  required,
  tooltip = '',
  htmlId,
  noColFormLabelClassname = false,
}) => {
  const labelClassName = clsx({
    'col-form-label': !noColFormLabelClassname,
    'field-required': required,
  });
  return (
    <label htmlFor={htmlId} className={labelClassName}>
      {label}
      {tooltip && ' '}
      <Tooltip text={tooltip} />
    </label>
  );
};

export default ComponentLabel;
