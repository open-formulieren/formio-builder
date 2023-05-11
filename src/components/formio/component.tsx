import clsx from 'clsx';
import React from 'react';

import {useValidationErrors} from '@/utils/errors';

import ComponentLabel from './component-label';

export interface ComponentProps {
  type: 'textfield' | 'select' | 'checkbox' | 'number' | 'datagrid' | 'datamap'; // TODO: can this be inferred from somewhere?
  field?: string;
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: string;
  htmlId?: string;
  children: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({
  type,
  field = '',
  required = false,
  label,
  tooltip = '',
  children,
  ...props
}) => {
  const {errors} = useValidationErrors(field);
  const className = clsx('form-group', 'has-feedback', 'formio-component', {
    [`formio-component-${type}`]: type,
    'has-error': field && errors.length > 0,
    required: required,
  });
  return (
    <div className={className}>
      {label && (
        <ComponentLabel label={label} required={required} htmlId={props.htmlId} tooltip={tooltip} />
      )}
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
