import {DateComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, MessageDescriptor, defineMessage, useIntl} from 'react-intl';

import {Select} from '@/components/formio';

import {AllModes, AllPossibleConstraints, DateConstraintKey, NonEmptyModes} from './types';

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
    variable: 'now',
    delta: {
      years: null,
      months: null,
      days: null,
    },
    operator: 'add',
  },
};

export interface ModeSelectProps {
  constraint: DateConstraintKey;
}

const ModeSelect: React.FC<ModeSelectProps> = ({constraint}) => {
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

export default ModeSelect;
