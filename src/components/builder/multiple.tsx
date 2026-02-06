import {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';
import {hasOwnProperty} from '@/types';

import {Checkbox} from '../formio';

const hasDefaultValue = (component: any): component is AnyComponentSchema & {defaultValue: any} => {
  return hasOwnProperty(component, 'defaultValue');
};

export interface MultipleProps {
  /**
   * If true, toggling the 'multiple' value will toggle the default value accordingly.
   *
   * E.g. `defaultValue: 'aaa'` becomes `defaultValue: ['aaa']` when multiple switches
   * from `false` to `true`.
   */
  updateDefaultValue?: boolean;
}

function Multiple<T = unknown>({updateDefaultValue = true}: MultipleProps) {
  const intl = useIntl();
  const {values, getFieldProps, setFieldValue} = useFormikContext<T>();
  const {onChange: formikOnChange} = getFieldProps<boolean>('multiple');
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Multiple values' builder field",
    defaultMessage: 'Are there multiple values possible for this field?',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formikOnChange(e);

    // only touch default value if we're allowed to
    if (!updateDefaultValue) return;

    // update the default value, if there is any
    if (!hasDefaultValue(values)) return;
    const {defaultValue} = values;
    if (defaultValue === undefined) return;

    const multiEnabled = e.target.checked;
    const newDefaultValue = multiEnabled ? [defaultValue] : defaultValue[0];
    setFieldValue('defaultValue', newDefaultValue);
  };

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="multiple"
      label={
        <FormattedMessage
          description="Label for 'Multiple values' builder field"
          defaultMessage="Multiple values"
        />
      }
      tooltip={tooltip}
      onChange={onChange}
    />
  );
}

export default Multiple;
