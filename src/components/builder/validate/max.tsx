import {FormattedMessage, useIntl} from 'react-intl';

import {NumberField} from '../../formio';

const Max: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.max' builder field",
    defaultMessage: 'The maximum value this field can have before the form can be submitted.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'validate.max' builder field",
    defaultMessage: 'Maximum value',
  });
  return (
    <NumberField
      name="validate.max"
      label={
        <FormattedMessage
          description="Label for 'validate.max' builder field"
          defaultMessage="Maximum value"
        />
      }
      placeholder={placeholder}
      tooltip={tooltip}
    />
  );
};

export default Max;
