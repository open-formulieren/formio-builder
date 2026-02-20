import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../../formio';

const Required = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

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
      disabled={formMode === 'appointment'}
    />
  );
};

export default Required;
