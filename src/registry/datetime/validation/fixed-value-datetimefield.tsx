import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {DateTimeField} from '@/components/formio';

import {DateConstraintKey} from './types';

type FixedValueTranslations = {
  label: MessageDescriptor;
  tooltip: MessageDescriptor;
};

const FIXED_VALUE_MESSAGES: Record<DateConstraintKey, FixedValueTranslations> = {
  minDate: defineMessages({
    label: {
      description: "Date field 'minDate' fixed value label",
      defaultMessage: 'Minimum date',
    },
    tooltip: {
      description: "Date field 'minDate' fixed value tooltip",
      defaultMessage: 'The minimum date that can be picked.',
    },
  }),
  maxDate: defineMessages({
    label: {
      description: "Date field 'maxDate' fixed value label",
      defaultMessage: 'Maximum date',
    },
    tooltip: {
      description: "Date field 'maxDate' fixed value tooltip",
      defaultMessage: 'The maximum date that can be picked.',
    },
  }),
};

export interface FixedValueDateTimeFieldProps {
  constraint: DateConstraintKey;
}

const FixedValueDateTimeField: React.FC<FixedValueDateTimeFieldProps> = ({constraint}) => {
  const intl = useIntl();
  return (
    <DateTimeField
      name={`datePicker.${constraint}`}
      label={intl.formatMessage(FIXED_VALUE_MESSAGES[constraint].label)}
      tooltip={intl.formatMessage(FIXED_VALUE_MESSAGES[constraint].tooltip)}
    />
  );
};

export default FixedValueDateTimeField;
