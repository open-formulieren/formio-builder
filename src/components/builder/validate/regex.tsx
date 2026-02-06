import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {TextField} from '../../formio';

/*
 * The description contains additional useful information/hints for a given field to
 * clarify what's expected by the end-user filling out the form.
 */
const RegexValidation: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.pattern' builder field",
    defaultMessage:
      'The regular expression pattern test that the field value must pass before the form can be submitted.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'validate.pattern' builder field",
    defaultMessage: 'Regular Expression Pattern',
  });

  return formMode === 'appointment' ? null : (
    <TextField
      name="validate.pattern"
      label={
        <FormattedMessage
          description="Label for 'validate.pattern' builder field"
          defaultMessage="Regular Expression Pattern"
        />
      }
      tooltip={tooltip}
      placeholder={placeholder}
    />
  );
};

export default RegexValidation;
