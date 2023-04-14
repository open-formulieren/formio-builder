import {Checkbox} from 'components/formio';
import {FormattedMessage, useIntl} from 'react-intl';

const Required = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.required' builder field",
    defaultMessage: 'A required field must be filled in before the form can be submitted.',
  });
  return (
    <Checkbox
      name="validate.required"
      label={
        <FormattedMessage
          description="Label for 'validate.required' builder field"
          defaultMessage="Required"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default Required;
