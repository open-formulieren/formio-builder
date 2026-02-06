import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {NumberField} from '../../formio';

const MaxLength: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.maxLength' builder field",
    defaultMessage: 'The maximum length requirement this field must meet.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'validate.maxLength' builder field",
    defaultMessage: 'Maximum length',
  });

  return formMode === 'appointment' ? null : (
    <NumberField
      name="validate.maxLength"
      label={
        <FormattedMessage
          description="Label for 'validate.maxLength' builder field"
          defaultMessage="Maximum length"
        />
      }
      placeholder={placeholder}
      tooltip={tooltip}
      min={1}
      step={1}
    />
  );
};

export default MaxLength;
