import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../formio';

const ReadOnly = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'ReadOnly' builder field",
    defaultMessage: 'Make this component read only.',
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="disabled"
      label={
        <FormattedMessage
          description="Label for 'ReadOnly' builder field"
          defaultMessage="Read only"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default ReadOnly;
