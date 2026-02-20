import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Checkbox} from '../formio';

const ShowCharCount = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'ShowCharCount' builder field",
    defaultMessage: 'Show a live count of the number of characters.',
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="showCharCount"
      label={
        <FormattedMessage
          description="Label for 'ShowCharCount' builder field"
          defaultMessage="Show character counter"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default ShowCharCount;
