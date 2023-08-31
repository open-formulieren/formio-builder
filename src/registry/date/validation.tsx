import {DateComponentSchema} from '@open-formulieren/types';
import {DateConstraintConfiguration} from '@open-formulieren/types/lib/formio/dates';
import {useFormikContext} from 'formik';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessage,
  defineMessages,
  useIntl,
} from 'react-intl';

import {Panel, Select} from '@/components/formio';
import {FilterByValueType} from '@/types';

type AllDateExtensions = Required<NonNullable<DateComponentSchema['openForms']>>;
type AllModes = DateConstraintConfiguration['mode'];
type NonEmptyModes = Exclude<AllModes, ''>;
type DateConstraintKey = keyof FilterByValueType<AllDateExtensions, {mode: AllModes}>;

// Mappings of value-label to produce dropdown options. Note that you need to filter out
// only the options relevant to the particular field.
const ALL_DATE_CONSTRAINT_MODE_OPTIONS: Array<{
  label: MessageDescriptor;
  value: NonEmptyModes;
}> = [
  {
    value: 'fixedValue',
    label: defineMessage({
      description: "Date constraint mode 'fixedValue' label",
      defaultMessage: 'Fixed value',
    }),
  },
  {
    value: 'future',
    label: defineMessage({
      description: "Date constraint mode 'future' label",
      defaultMessage: 'In the future',
    }),
  },
  {
    value: 'past',
    label: defineMessage({
      description: "Date constraint mode 'past' label",
      defaultMessage: 'In the past',
    }),
  },
  {
    value: 'relativeToVariable',
    label: defineMessage({
      description: "Date constraint mode 'relativeToVariable' label",
      defaultMessage: 'Relative to variable',
    }),
  },
];

export interface DateConstraintProps {
  constraint: DateConstraintKey;
}

const MODES_TO_EXCLUDE: Record<DateConstraintKey, NonEmptyModes[]> = {
  minDate: ['past'],
  maxDate: ['future'],
};

const ModeSelect: React.FC<DateConstraintProps> = ({constraint}) => {
  const intl = useIntl();

  // filter out the validation modes not relevant for this particular constraint
  const modesToExclude = MODES_TO_EXCLUDE[constraint];
  const options = ALL_DATE_CONSTRAINT_MODE_OPTIONS.filter(
    opt => !modesToExclude.includes(opt.value)
  );

  return (
    <Select
      name={`openForms.${constraint}.mode`}
      label={
        <FormattedMessage
          description="Label for 'date constraint mode' builder field"
          defaultMessage="Mode preset"
        />
      }
      options={options.map(item => ({
        ...item,
        label: intl.formatMessage(item.label),
      }))}
    />
  );
};

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

const DateConstraintValidation: React.FC<DateConstraintProps> = ({constraint}) => {
  const intl = useIntl();
  const {values} = useFormikContext<DateComponentSchema>();
  const hasMode = !!values?.openForms?.[constraint]?.mode;
  return (
    <Panel
      title={intl.formatMessage(PANEL_TITLES[constraint], {
        configured: String(hasMode),
        foo: 'bar',
      })}
      collapsible
      initialCollapsed={false}
    >
      <ModeSelect constraint={constraint} />
    </Panel>
  );
};

export default DateConstraintValidation;
