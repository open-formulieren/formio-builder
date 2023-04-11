import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '../formio';

const ClearOnHide = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'ClearOnHide' builder field",
    defaultMessage:
      'Remove the value of this field from the submission if it is hidden. Note: the value of this field is then also not used in logic rules!',
  });
  return (
    <Checkbox
      name="clearOnHide"
      label={
        <FormattedMessage
          description="Label for 'ClearOnHide' builder field"
          defaultMessage="Clear on hide"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default ClearOnHide;
