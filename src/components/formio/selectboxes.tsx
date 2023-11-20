import {ReactNode} from 'react';

import {CheckboxInput} from './checkbox';
import Component from './component';
import Description from './description';

export interface Option {
  value: string;
  label: ReactNode;
}

export interface SelectBoxesProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
}

export const SelectBoxes: React.FC<SelectBoxesProps> = ({
  name,
  options,
  label,
  required = false,
  tooltip = '',
  description = '',
}) => {
  return (
    <Component type="selectboxes" field={name} label={label} tooltip={tooltip} required={required}>
      <div className="form-radio radio">
        {options.map(({value, label}, index) => (
          <div key={`option-${value}-${index}`} className="form-check">
            <label className="form-check-label">
              <CheckboxInput name={`${name}.${value}`} label={label} />
            </label>
          </div>
        ))}
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default SelectBoxes;
