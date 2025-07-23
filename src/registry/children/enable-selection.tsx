import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '@/components/formio';

const EnableSelection = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'enableSelection' builder field",
    defaultMessage:
      'Allow the selection of specific children that are retrieved from the external source for further processing.',
  });
  return (
    <Checkbox
      name="enableSelection"
      label={
        <FormattedMessage
          description="Label for 'enableSelection' builder field"
          defaultMessage="Enable selection"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EnableSelection;
