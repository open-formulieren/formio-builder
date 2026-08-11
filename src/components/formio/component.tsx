import {clsx} from 'clsx';
import type React from 'react';

import type {AnyComponentSchema} from '@/types';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import ComponentLabel from './component-label';
import './component.scss';
import Description from './description';

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
  description?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({
  type,
  field = '',
  required = false,
  label,
  tooltip = '',
  children,
  className: extraClassName = '',
  description = '',
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
      {description && <Description text={description} />}
      <ErrorList errors={errors} />
      {children}
    </div>
  );
};

export default Component;
