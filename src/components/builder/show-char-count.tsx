import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const ShowCharCount = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'ShowCharCount' builder field",
    defaultMessage: 'Show a live count of the number of characters.',
  });
  return (
    <Checkbox
      name="showCharCount"
      label={
        <FormattedMessage
          description="Label for 'ShowCharCount' builder field"
          defaultMessage="Show character counter"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default ShowCharCount;
