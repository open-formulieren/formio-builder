import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const Multiple = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Multiple values' builder field",
    defaultMessage: 'Are there multiple values possible for this field?',
  });
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
    />
  );
};

export default Multiple;
