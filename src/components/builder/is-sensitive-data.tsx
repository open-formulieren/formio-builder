import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const IsSensitiveData = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'IsSensitiveData' builder field",
    defaultMessage:
      'The data entered in this component will be removed in accordance with the privacy settings.',
  });
  return (
    <Checkbox
      name="isSensitiveData"
      label={
        <FormattedMessage
          description="Label for 'IsSensitiveData' builder field"
          defaultMessage="Is sensitive data"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default IsSensitiveData;
