import {useField} from 'formik';
import React from 'react';
import ReactSelect from 'react-select';
import type {
  GroupBase,
  OptionsOrGroups,
  Props as RSProps,
} from 'react-select/dist/declarations/src';

import Component from './component';
import Description from './description';

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
  description?: React.ReactNode;
  isClearable?: boolean;
  valueProperty?: string;
  onChange?: (event: {target: {name: string; value: any}}) => void;
}

function isOption<Option, Group extends GroupBase<Option> = GroupBase<Option>>(
  opt: Option | Group
): opt is Option {
  return (opt as Group).options === undefined;
}

function isOptionGroup<Option, Group extends GroupBase<Option> = GroupBase<Option>>(
  opt: Option | Group
): opt is Group {
  return (opt as Group).options !== undefined;
}

function extractSelectedValue<Option extends {[key: string]: any}, Group extends GroupBase<Option>>(
  options: OptionsOrGroups<Option, Group>,
  currentValue: any,
  isSingle: boolean,
  valueProperty: string = 'value'
): any {
  // normalize everything to arrays, for isSingle -> return the first (and only) element.
  const normalizedCurrentValue: any[] = isSingle ? [currentValue] : currentValue;
  const value: any[] = [];

  const valueTest = (opt: Option) => normalizedCurrentValue.includes(opt[valueProperty]);

  for (const optionOrGroup of options) {
    if (isOption<Option, Group>(optionOrGroup) && valueTest(optionOrGroup)) {
      value.push(optionOrGroup);
    }
    if (isOptionGroup<Option, Group>(optionOrGroup)) {
      for (const option of optionOrGroup.options) {
        if (valueTest(option)) {
          value.push(option);
        }
      }
    }
  }
  // if no value is set an isSingle is true -> returns undefined, as intended
  return isSingle ? value[0] : value;
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
  description = '',
  isClearable = false,
  valueProperty = 'value',
  onChange,
  ...props
}: SelectProps<Option, IsMulti, Group>) {
  const [field, , {setValue}] = useField(name);
  const htmlId = `editform-${name}`;

  let value = undefined;
  if (props.options) {
    const currentValue = field.value;
    const isSingle = !Array.isArray(currentValue);
    value = extractSelectedValue<Option, Group>(
      props.options,
      currentValue,
      isSingle,
      valueProperty
    );
  }

  return (
    <Component
      type="select"
      field={name}
      required={required}
      htmlId={htmlId}
      label={label}
      tooltip={tooltip}
    >
      <div>
        {/* TODO: add classname/styling for error state */}
        <ReactSelect
          inputId={htmlId}
          isClearable={isClearable}
          getOptionValue={opt => isOption<Option, Group>(opt) && opt[valueProperty]}
          className="formio-builder-select"
          {...field}
          {...props}
          onChange={newValue => {
            const isSingle = !Array.isArray(newValue);
            const normalized = isSingle ? [newValue] : newValue;
            const rawValues = normalized.map(val => val?.[valueProperty] ?? null);
            const rawValue = isSingle ? rawValues[0] : rawValues;
            setValue(rawValue);
            onChange?.({target: {name, value: rawValue}});
          }}
          value={value}
        />
      </div>
      {description && <Description text={description} />}
    </Component>
  );
}

export default Select;
