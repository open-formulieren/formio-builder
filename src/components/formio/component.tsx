import clsx from 'clsx';
import React from 'react';

import {AnyComponentSchema} from '@/types';
import {useValidationErrors} from '@/utils/errors';
import {ErrorList} from '@/utils/errors';

import ComponentLabel from './component-label';
import './component.scss';

export interface ComponentProps {
  // XXX: eventually (most) of these literals will be included in AnyComponentType
  type: AnyComponentSchema['type'] | 'datagrid' | 'datamap' | 'select' | 'columns' | 'textarea';
  field?: string;
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
  htmlId?: string;
  children: React.ReactNode;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({
  type,
  field = '',
  required = false,
  label,
  tooltip = '',
  children,
  className: extraClassName = '',
  ...props
}) => {
  const {errors} = useValidationErrors(field);
  const className = clsx('form-group', 'has-feedback', 'formio-component', 'offb-component', {
    [`formio-component-${type}`]: type,
    'has-error': field && errors.length > 0,
    required: required,
    [extraClassName]: !!extraClassName,
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
