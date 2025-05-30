import {FormattedMessage} from 'react-intl';

import {CheckboxInput} from './checkbox';
import Component from './component';
import Description from './description';

export interface Option {
  value: string;
  label: React.ReactNode;
  description?: string;
}

export interface SelectBoxesProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  description?: string;
  isLoading?: boolean;
}

export const SelectBoxes: React.FC<SelectBoxesProps> = ({
  name,
  options,
  label,
  required = false,
  tooltip = '',
  description = '',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <FormattedMessage description="Text for loading values" defaultMessage="Loading values..." />
    );
  }

  return (
    <Component type="selectboxes" field={name} label={label} tooltip={tooltip} required={required}>
      <div className="form-radio radio">
        {options.map(({value, label, description}, index) => (
          <div key={`option-${value}-${index}`} className="form-check">
            <label className="form-check-label">
              <CheckboxInput
                name={`${name}.${value}`}
                label={label}
                optionDescription={description}
              />
            </label>
          </div>
        ))}
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default SelectBoxes;
