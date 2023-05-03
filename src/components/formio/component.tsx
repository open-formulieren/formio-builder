import clsx from 'clsx';
import React from 'react';

import Tooltip from './tooltip';

export interface ComponentProps {
  type: 'textfield' | 'select' | 'checkbox' | 'number' | 'datagrid' | 'datamap'; // TODO: can this be inferred from somewhere?
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: string;
  htmlId?: string;
  errors?: string[];
  children: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({
  type,
  required = false,
  label,
  tooltip = '',
  errors = [],
  children,
  ...props
}) => {
  const className = clsx('form-group', 'has-feedback', 'formio-component', {
    [`formio-component-${type}`]: type,
    'has-error': errors.length > 0,
    required: required,
  });
  const labelClassName = clsx('col-form-label', {'field-required': required});
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={props.htmlId || undefined} className={labelClassName}>
          {label}
          {tooltip && ' '}
          <Tooltip text={tooltip} />
        </label>
      ) : null}
      {children}
      <div className="formio-errors invalid-feedback">
        {errors.map((error, index) => (
          <div key={index} className="form-text error">
            {error}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Component;
