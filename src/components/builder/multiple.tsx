import {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {hasOwnProperty} from '@/types';

import {Checkbox} from '../formio';

const hasDefaultValue = (component: any): component is AnyComponentSchema & {defaultValue: any} => {
  return hasOwnProperty(component, 'defaultValue');
};

function Multiple<T = unknown>() {
  const intl = useIntl();
  const {values, getFieldProps, setFieldValue} = useFormikContext<T>();
  const {onChange: formikOnChange} = getFieldProps<boolean>('multiple');

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Multiple values' builder field",
    defaultMessage: 'Are there multiple values possible for this field?',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formikOnChange(e);
    // update the default value, if there is any
    if (!hasDefaultValue(values)) return;
    const {defaultValue} = values;
    if (defaultValue === undefined) return;

    const multiEnabled = e.target.checked;
    const newDefaultValue = multiEnabled ? [defaultValue] : defaultValue[0];
    setFieldValue('defaultValue', newDefaultValue);
  };

  return (
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
