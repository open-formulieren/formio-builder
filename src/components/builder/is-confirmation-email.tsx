import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../formio';

const IsConfirmationRecipient: React.FC = () => {
  const intl = useIntl();
  const {formType} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'confirmationRecipient' builder field",
    defaultMessage: 'Email-address in this field will receive the confirmation email.',
  });

  return formType === 'appointment' ? null : (
    <Checkbox
      name="confirmationRecipient"
      label={
        <FormattedMessage
          description="Label for 'confirmationRecipient' builder field"
          defaultMessage="Receives confirmation email"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default IsConfirmationRecipient;
