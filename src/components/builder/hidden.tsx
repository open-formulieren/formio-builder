import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const Hidden = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Hidden' builder field",
    defaultMessage: 'Hide a field from the form.',
  });
  return (
    <Checkbox
      name="hidden"
      label={
        <FormattedMessage description="Label for 'Hidden' builder field" defaultMessage="Hidden" />
      }
      tooltip={tooltip}
    />
  );
};

export default Hidden;
