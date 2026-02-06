import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../formio';

const IsSensitiveData = ({disabled = false}) => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'IsSensitiveData' builder field",
    defaultMessage:
      'The data entered in this component will be removed in accordance with the privacy settings.',
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="isSensitiveData"
      label={
        <FormattedMessage
          description="Label for 'IsSensitiveData' builder field"
          defaultMessage="Is sensitive data"
        />
      }
      tooltip={tooltip}
      // Note that `disabled` results in this form field not being submitted at all in traditional
      // HTML forms. However, with Formik, the value is tracked in the React state and will
      // still be included. Normally we'd use the `readonly` attribute, but checkboxes don't
      // support this and require us to use `disabled`.
      disabled={disabled}
    />
  );
};

export default IsSensitiveData;
