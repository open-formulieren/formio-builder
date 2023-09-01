import {DateComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {Panel} from '@/components/formio';

import ModeSelect from './constraint-mode';
import FixedValueDateField from './fixed-value-datefield';
import IncludeToday from './include-today';
import RelativeDelta from './relative-delta';
import {DateConstraintKey} from './types';

const PANEL_TITLES: Record<DateConstraintKey, MessageDescriptor> = defineMessages({
  minDate: {
    description: "Date field 'minDate' validation panel title",
    defaultMessage: 'Minimum date {configured, select, false {(not set)} other {}}',
  },
  maxDate: {
    description: "Date field 'maxDate' validation panel title",
    defaultMessage: 'Maximum date {configured, select, false {(not set)} other {}}',
  },
});

export interface DateConstraintProps {
  constraint: DateConstraintKey;
}

const DateConstraintValidation: React.FC<DateConstraintProps> = ({constraint}) => {
  const intl = useIntl();
  const {values} = useFormikContext<DateComponentSchema>();
  const mode = values?.openForms?.[constraint]?.mode || '';
  console.log(values);
  return (
    <Panel
      title={intl.formatMessage(PANEL_TITLES[constraint], {configured: String(mode !== '')})}
      collapsible
      initialCollapsed={false}
    >
      <ModeSelect constraint={constraint} />
      {mode === 'fixedValue' && <FixedValueDateField constraint={constraint} />}
      {['future', 'past'].includes(mode) && <IncludeToday constraint={constraint} />}
      {mode === 'relativeToVariable' && <RelativeDelta constraint={constraint} />}
    </Panel>
  );
};

export default DateConstraintValidation;
