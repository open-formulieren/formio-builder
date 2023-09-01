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

import {DateField, Panel, Select} from '@/components/formio';
import {FilterByValueType} from '@/types';

// A bunch of derived types from the DateComponentSchema that makes working with the
// schema a bit more readable while keeping everything exhaustive and type safe.
type AllDateExtensions = Required<NonNullable<DateComponentSchema['openForms']>>;
type AllModes = DateConstraintConfiguration['mode'];
type NonEmptyModes = Exclude<AllModes, ''>;
type DateConstraintKey = keyof FilterByValueType<AllDateExtensions, {mode: AllModes}>;
type AllPossibleConstraints = AllDateExtensions[DateConstraintKey];

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

const DEFAULT_VALUES: {
  [K in AllPossibleConstraints['mode']]: Omit<Extract<AllPossibleConstraints, {mode: K}>, 'mode'>;
} = {
  '': {},
  fixedValue: {},
  future: {includeToday: false},
  past: {includeToday: false},
  relativeToVariable: {
    variable: '',
    delta: {
      years: null,
      months: null,
      days: null,
    },
    operator: 'add',
  },
};

const ModeSelect: React.FC<DateConstraintProps> = ({constraint}) => {
  const fieldName = `openForms.${constraint}.mode`;
  const intl = useIntl();
  const {setFieldValue} = useFormikContext<DateComponentSchema>();

  // filter out the validation modes not relevant for this particular constraint
  const modesToExclude = MODES_TO_EXCLUDE[constraint];
  const options = ALL_DATE_CONSTRAINT_MODE_OPTIONS.filter(
    opt => !modesToExclude.includes(opt.value)
  );

  return (
    <Select
      name={fieldName}
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
      isClearable
      onChange={event => {
        // the select *always* sets the selected value in the state, we can just use an
        // additional onChange here (as better alternative to useEffect).
        // The idea here is that we set the default, empty values that are mode-specific
        // so that we don't get "uncontrolled-component-becomes-controlled" warning
        // from React. It also helps in clearing out any left-over state from other
        // modes when switching between them.
        const mode: AllModes = event.target.value ?? '';
        const emptyDefaults = {mode, ...DEFAULT_VALUES[mode]};
        setFieldValue(`openForms.${constraint}`, emptyDefaults);
        // whenever the mode *changes*, clear the datePicker fixed value to prevent
        // stale values from being in the form state while visually hidden
        setFieldValue(`datePicker.${constraint}`, null);
      }}
    />
  );
};

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

const FixedValueDateField: React.FC<DateConstraintProps> = ({constraint}) => {
  const intl = useIntl();
  return (
    <DateField
      name={`datePicker.${constraint}`}
      label={intl.formatMessage(FIXED_VALUE_MESSAGES[constraint].label)}
      tooltip={intl.formatMessage(FIXED_VALUE_MESSAGES[constraint].tooltip)}
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
  const mode = values?.openForms?.[constraint]?.mode || '';
  console.log(values);
  return (
    <Panel
      title={intl.formatMessage(PANEL_TITLES[constraint], {
        configured: String(mode !== ''),
        foo: 'bar',
      })}
      collapsible
      initialCollapsed={false}
    >
      <ModeSelect constraint={constraint} />
      {mode === 'fixedValue' && <FixedValueDateField constraint={constraint} />}
    </Panel>
  );
};

export default DateConstraintValidation;
