import {css} from '@emotion/css';
import clsx from 'clsx';
import React from 'react';

import {AnyComponentSchema} from '@/types';
import {useValidationErrors} from '@/utils/errors';
import {ErrorList} from '@/utils/errors';

import Tooltip from './tooltip';

export interface FieldsetProps {
  // XXX: eventually (most) of these literals will be included in AnyComponentType
  type: AnyComponentSchema['type'] | 'datagrid' | 'datamap' | 'select' | 'columns' | 'textarea';
  field?: string;
  required?: boolean;
  label?: React.ReactNode;
  tooltip?: string;
  htmlId?: string;
  children: React.ReactNode;
}

// Fix the overlapping icons/text when the error icon is shown.
// XXX: once we've moved away from bootstrap/formio 'component library', this fix and
// @emotion/css can be removed again.
const PAD_ERROR_ICON = css`
  .form-control.is-invalid {
    padding-inline-end: calc(1.5em + 0.75rem);
  }
`;

const Fieldset: React.FC<FieldsetProps> = ({
  type,
  field = '',
  required = false,
  label,
  tooltip = '',
  children,
}) => {
  const {errors} = useValidationErrors(field);
  const className = clsx('form-group', 'has-feedback', 'formio-component', PAD_ERROR_ICON, {
    [`formio-component-${type}`]: type,
    'has-error': field && errors.length > 0,
    required: required,
  });
  // const labelClassName = clsx('col-form-label', {'field-required': required});

  return (
    <div className={className}>
      <fieldset>
        {label && (
          <legend>
            {label}
            {tooltip && ' '}
            <Tooltip text={tooltip} />
          </legend>
        )}
        {children}
        <ErrorList errors={errors} />
      </fieldset>
    </div>
  );
};

export default Fieldset;
