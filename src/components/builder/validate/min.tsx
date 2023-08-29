import {FormattedMessage, useIntl} from 'react-intl';

import {NumberField} from '../../formio';

const Min: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.min' builder field",
    defaultMessage: 'The minimum value this field can have before the form can be submitted.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'validate.min' builder field",
    defaultMessage: 'Minimum value',
  });
  return (
    <NumberField
      name="validate.min"
      label={
        <FormattedMessage
          description="Label for 'validate.min' builder field"
          defaultMessage="Minimum value"
        />
      }
      placeholder={placeholder}
      tooltip={tooltip}
    />
  );
};

export default Min;
