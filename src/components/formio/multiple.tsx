/**
 * Wrapper/HOC component to enable multi-input behaviour for (certain) fields.
 *
 * This component operates on arrays of values instead of just scalars, e.g. a list of
 * strings, a list of dates... This is not guaranteed to be compatible with every
 * 'atomic' component type of Form.io - Select/File upload handle this property
 * themselves rather than needing to be wrapped.
 *
 * Usage:
 *
 *   const MyComponent = ({name, label, description, ...props}) => {...}
 *   const MultipleMyComponent = withMultiple(MyComponent);
 *
 *   <MyComponent name="foo" {...props} />  // <input name="foo" />
 *   <MultipleMyComponent multiple={true|false} name="foo" {...props} /> // <input name="foo[0]" /> etc. />
 *
 */
import {FieldArray, useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {RenderContext} from '@/context';

import ComponentLabel, {ComponentLabelProps} from './component-label';
import Description from './description';

/*
  name, label and description are typically passed in via the generic form.io
  component properties. We need to enforce them here, as the wrapper layout needs
  them.
*/
export interface CommonInputProps extends ComponentLabelProps {
  name: string;
  description?: string;
}

export interface MultipleProps<P extends {}, T extends unknown> {
  as: React.ComponentType<P>;
  defaultValue: T; // data type, which is component type specific (textfield -> string, number -> number)
}

const Multiple = <P extends {}, T>(props: MultipleProps<P, T> & CommonInputProps) => {
  const {label, description, required, tooltip} = props;
  const {as: WrappedComponent, defaultValue, name, ...otherProps} = props;
  // TypeScript can't infer this itself with generics, as it doesn't know yet what P looks
  // like by omitting multiple - but *we* know that HoC forward the remainder of the props.
  const nestedProps = otherProps as unknown as P;

  const {getFieldProps} = useFormikContext();
  let {value: fieldValue} = getFieldProps<T[]>(name);

  // due to possibly bad value initialization, it's possible the value is undefined or
  // even a completely different type (because you're switching from multiple false -> true)
  // TODO: figure out we can figure this at the formik level? this probably depends on render
  // order though
  if (!Array.isArray(fieldValue)) {
    fieldValue = [];
  }

  return (
    <RenderContext.Provider value={{bareInput: true}}>
      {label && <ComponentLabel label={label} required={required} tooltip={tooltip} />}
      <FieldArray name={name}>
        {arrayHelpers => (
          <table className="table table-bordered">
            <tbody>
              {(fieldValue || []).map((_, index) => (
                <tr key={index}>
                  <td>
                    <WrappedComponent name={`${name}[${index}]`} {...nestedProps} />
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <span className="sr-only">
                        <FormattedMessage
                          description="'Remove item' screenreader button text"
                          defaultMessage="Remove item"
                        />
                      </span>
                      <i className="fa fa-times-circle-o" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>
                  <button
                    type="button"
                    className="btn btn-primary formio-button-add-another"
                    onClick={() => arrayHelpers.push(defaultValue)}
                  >
                    <i className="fa fa-plus"></i>
                    <FormattedMessage
                      description="'Add another' button text for 'multiple' components"
                      defaultMessage="Add another"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </FieldArray>
      {description && <Description text={description} />}
    </RenderContext.Provider>
  );
};

export interface WithMultipleProps {
  multiple?: boolean;
}

/**
 * Wrap a given component into a higher order Multiple component.
 */
export function withMultiple<P extends CommonInputProps, T extends unknown = unknown>(
  WrappedComponent: React.ComponentType<P>,
  defaultValue: T
) {
  return (props: WithMultipleProps & P) => {
    const {multiple, ...otherProps} = props;
    // TypeScript can't infer this itself with generics, as it doesn't know yet what P looks
    // like by omitting multiple - but *we* know that HoC forward the remainder of the props.
    const nestedProps = otherProps as unknown as P;
    // in single value/scalar mode -> just render the component itself
    if (!multiple) {
      return <WrappedComponent {...nestedProps} />;
    }
    // otherwise, go into array-of-fields mode
    return <Multiple<P, T> as={WrappedComponent} defaultValue={defaultValue} {...otherProps} />;
  };
}

export default Multiple;
