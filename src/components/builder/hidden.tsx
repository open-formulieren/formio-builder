import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../formio';

const Hidden = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Hidden' builder field",
    defaultMessage: 'Hide a field from the form.',
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="hidden"
      label={
        <FormattedMessage description="Label for 'Hidden' builder field" defaultMessage="Hidden" />
      }
      tooltip={tooltip}
    />
  );
};

export default Hidden;
