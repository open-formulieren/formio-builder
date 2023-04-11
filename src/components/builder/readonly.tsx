import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const ReadOnly = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'ReadOnly' builder field",
    defaultMessage: 'Make this component read only.',
  });
  return (
    <Checkbox
      name="disabled"
      label={
        <FormattedMessage
          description="Label for 'ReadOnly' builder field"
          defaultMessage="Read only"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default ReadOnly;
