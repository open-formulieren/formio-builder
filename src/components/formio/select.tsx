import {useField} from 'formik';
import React from 'react';
import ReactSelect from 'react-select';
import type {
  GroupBase,
  OptionsOrGroups,
  Props as RSProps,
  ThemeConfig,
} from 'react-select/dist/declarations/src';
import {MultiValue} from 'react-select/dist/declarations/src';

import Component from './component';
import Description from './description';

// alias so that we can keep track of them and improve with generics at some point.
type ValueType = any;

// See https://react-select.com/typescript
// TODO: revisit the generics here, they were from before I better understood TypeScript.

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
  emptyValue?: ValueType;
  onChange?: (event: {target: {name: string; value: ValueType}}) => void;
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
  currentValue: ValueType,
  isSingle: boolean,
  valueProperty: string = 'value'
): ValueType {
  // normalize everything to arrays, for isSingle -> return the first (and only) element.
  const normalizedCurrentValue: ValueType[] = isSingle ? [currentValue] : currentValue;
  const value: ValueType[] = [];

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

// See https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/theme.ts
const BUILDER_SELECT_THEME: ThemeConfig = theme => ({
  ...theme,
  borderRadius: 4, // same as bootstrap inputs
});

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
  // react-select uses null internally, see
  // https://github.com/JedWatson/react-select/blob/06e34882638d1526b9f5a1238bb567a3e9460ce5/packages/react-select/src/Select.tsx#L1083
  emptyValue = null,
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
        <ReactSelect<Option, IsMulti, Group>
          inputId={htmlId}
          isClearable={isClearable}
          getOptionValue={opt => isOption<Option, Group>(opt) && opt[valueProperty]}
          className="formio-builder-select"
          classNamePrefix="formio-builder-select"
          theme={BUILDER_SELECT_THEME}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: 'var(--form-input-bg, #fff)',
              borderColor: state.isFocused
                ? 'var(--body-quiet-color, #666)'
                : 'var(--border-color, #ccc)',
              boxShadow: undefined,
              '&:hover': {
                borderColor: undefined,
              },
            }),
            placeholder: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-quiet-color, #e0e0e0)',
            }),
            indicatorSeparator: baseStyles => ({
              ...baseStyles,
              backgroundColor: 'var(--border-color, #ccc)',
            }),
            dropdownIndicator: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-quiet-color, #e0e0e0)',
              '&:hover': {
                color: 'var(--body-loud-color, #000)',
              },
            }),
            clearIndicator: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-quiet-color, #e0e0e0)',
              '&:hover': {
                color: 'var(--body-loud-color, #000)',
              },
            }),
            valueContainer: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-fg, #333)',
            }),
            input: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-fg, #333)',
            }),
            singleValue: baseStyles => ({
              ...baseStyles,
              color: 'var(--body-fg, #333)',
            }),
            multiValue: baseStyles => ({
              ...baseStyles,
              backgroundColor: 'var(--default-button-bg, #017092)',
            }),
            multiValueLabel: baseStyles => ({
              ...baseStyles,
              color: 'var(--formio-dropdown-value-label-color, #fff)',
            }),
            multiValueRemove: baseStyles => ({
              ...baseStyles,
              color: 'var(--formio-dropdown-value-label-color, #fff)',
            }),
            menu: baseStyles => ({
              ...baseStyles,
              backgroundColor: 'var(--form-input-bg, #fff)',
              borderColor: 'var(--border-color, #ccc)',
            }),
            menuList: baseStyles => ({
              ...baseStyles,
              border: 'solid 1px var(--border-color, #ccc)',
              borderRadius: '4px',
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              color: 'var(--body-fg, #333)',
              backgroundColor: state.isFocused
                ? 'var(--formio-dropdown-highlighted-bg, #f2f2f2)'
                : undefined,
            }),
          }}
          menuPlacement="auto"
          {...field}
          {...props}
          onChange={(newValue, action) => {
            const isSingle = !Array.isArray(newValue);

            // for multiple, the value is reset to empty array (`[]`)
            if (action.action === 'clear' && isSingle) {
              newValue = emptyValue;
            }

            const normalized = (isSingle ? [newValue] : newValue) as MultiValue<Option>;
            const rawValues = normalized.map(val => val?.[valueProperty] ?? emptyValue);
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
