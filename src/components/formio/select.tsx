import {useField} from 'formik';
import React from 'react';
import ReactSelect from 'react-select';
import type {GroupBase, Props as RSProps} from 'react-select/dist/declarations/src';

import Component from './component';

// See https://react-select.com/typescript

export interface SelectProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<RSProps<Option, IsMulti, Group>, 'onChange' | 'value'> {
  name: string;
  label?: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  isClearable?: boolean;
  valueProperty?: string;
}

function isOption<Option, Group extends GroupBase<Option> = GroupBase<Option>>(
  opt: Option | Group
): opt is Option {
  return (opt as Group).options === undefined;
}

// can't use React.FC with generics
function Select<
  Option extends {[key: string]: any},
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  label,
  required = false,
  tooltip = '',
  isClearable = false,
  valueProperty = 'value',
  ...props
}: SelectProps<Option, IsMulti, Group>) {
  const [field, , {setValue}] = useField(name);
  const htmlId = `editform-${name}`;

  let value = undefined;
  if (props.options) {
    const currentValue = field.value;
    const isSingle = !Array.isArray(currentValue);
    if (isSingle) {
      value =
        props.options.find(
          opt => isOption<Option, Group>(opt) && opt[valueProperty] === currentValue
        ) || null;
    } else {
      value = props.options.filter(
        opt => isOption<Option, Group>(opt) && currentValue.includes(opt[valueProperty])
      );
    }
  }

  return (
    <Component type="select" required={required} htmlId={htmlId} label={label} tooltip={tooltip}>
      <div>
        <ReactSelect
          inputId={htmlId}
          isClearable={isClearable}
          getOptionValue={opt => isOption<Option, Group>(opt) && opt[valueProperty]}
          {...field}
          {...props}
          onChange={newValue => {
            const isSingle = !Array.isArray(newValue);
            const normalized = isSingle ? [newValue] : newValue;
            const rawValues = normalized.map(val => val?.[valueProperty] ?? null);
            const rawValue = isSingle ? rawValues[0] : rawValues;
            setValue(rawValue);
          }}
          value={value}
        />
      </div>
    </Component>
  );
}

export default Select;
