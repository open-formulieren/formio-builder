import {useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs';
import {useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {NumberField} from '@components/formio';

export interface MaxLengthProps {
  defaultValue?: number;
}

const FIELD_NAME = 'validate.maxLength';

const MaxLength: React.FC<MaxLengthProps> = ({defaultValue = 1000}) => {
  const intl = useIntl();
  const {initialValues, setFieldValue} = useFormikContext<ExtendedComponentSchema>();

  useEffect(() => {
    if (initialValues?.validate?.maxLength != null) return;
    setFieldValue(FIELD_NAME, defaultValue);
  }, []);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.maxLength' builder field",
    defaultMessage: 'The maximum length requirement this field must meet.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'validate.maxLength' builder field",
    defaultMessage: 'Maximum length',
  });
  return (
    <NumberField
      name={FIELD_NAME}
      label={
        <FormattedMessage
          description="Label for 'validate.maxLength' builder field"
          defaultMessage="Maximum length"
        />
      }
      placeholder={placeholder}
      tooltip={tooltip}
      min={1}
      step={1}
    />
  );
};

export default MaxLength;
