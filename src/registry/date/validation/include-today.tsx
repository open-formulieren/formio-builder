import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '@/components/formio';

import {DateConstraintKey} from './types';

export interface IncludeTodayProps {
  constraint: DateConstraintKey;
}

const IncludeToday: React.FC<IncludeTodayProps> = ({constraint}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'date constraint includeToday' builder validation field",
    defaultMessage: 'If checked, the current day is an allowed value.',
  });
  return (
    <Checkbox
      name={`openForms.${constraint}.includeToday`}
      label={
        <FormattedMessage
          description="Label for 'date constraint includeToday' builder validation field"
          defaultMessage="Including today"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default IncludeToday;
