import {useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../../formio';

type ComponentWithRequiredOptions = {
  validate?: {
    required?: boolean;
  };
  openForms?: {
    softRequired?: boolean;
  };
};

const SoftRequired = () => {
  const intl = useIntl();
  const {values, setFieldValue} = useFormikContext<ComponentWithRequiredOptions>();

  const isRequired = values?.validate?.required ?? false;
  const isSoftRequired = values?.openForms?.softRequired ?? false;

  // if the field is hard required, we must disable the soft required option, and
  // synchronize the softRequired to uncheck the option (if needed)
  useEffect(() => {
    if (isRequired && isSoftRequired) {
      setFieldValue('openForms.softRequired', false);
    }
  }, [setFieldValue, isRequired, isSoftRequired]);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'openForms.softRequired' builder field",
    defaultMessage: `Soft required fields should be filled out, but empty values don't
    block the users' progress. Sometimes this is needed for legal reasons. A component
    cannot be hard and soft required at the same time.`,
  });
  return (
    <Checkbox
      name="openForms.softRequired"
      label={
        <FormattedMessage
          description="Label for 'openForms.softRequired' builder field"
          defaultMessage="Soft required"
        />
      }
      tooltip={tooltip}
      disabled={isRequired}
    />
  );
};

export default SoftRequired;
