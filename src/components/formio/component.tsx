import clsx from 'clsx';
import React from 'react';

import {AnyComponentSchema} from '@/types';
import {useValidationErrors} from '@/utils/errors';
import {ErrorList} from '@/utils/errors';

import ComponentLabel from './component-label';

export interface ComponentProps {
  // XXX: eventually (most) of these literals will be included in AnyComponentType
  type: AnyComponentSchema['type'] | 'checkbox' | 'datagrid' | 'datamap' | 'select';
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
      <ErrorList errors={errors} />
    </div>
  );
};

export default Component;
