import clsx from 'clsx';
import type React from 'react';

import {useValidationErrors, ErrorList} from '@/utils/errors';

import './fieldset.scss';
import Tooltip from './tooltip';

export interface FieldsetProps {
  field?: string;
  label?: React.ReactNode;
  tooltip?: string;
  children: React.ReactNode;
}

const Fieldset: React.FC<FieldsetProps> = ({field = '', label, tooltip = '', children}) => {
  const {errors} = useValidationErrors(field);
  const className = clsx('field-group', 'offb-fieldset');

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
