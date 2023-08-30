import {DateComponentSchema} from '@open-formulieren/types';

// import {useFormikContext} from 'formik';
// import {FormattedMessage, useIntl} from 'react-intl';
import {EditFormDefinition} from '@/registry/types';

/**
 * Form to configure a Formio 'date' type component.
 */
const EditForm: EditFormDefinition<DateComponentSchema> = () => {
  // const {errors} = useFormikContext<DateComponentSchema>();
  return <>henlo</>;
};

EditForm.defaultValues = {
  // basic tab
  label: '',
  key: '',
  description: '',
  tooltip: '',
  showInSummary: true,
  showInEmail: false,
  showInPDF: true,
  multiple: false,
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  defaultValue: '',
  disabled: false,
  // Advanced tab
  conditional: {
    show: undefined,
    when: '',
    eq: '',
  },
  // Validation tab
  validate: {
    required: false,
    plugins: [],
  },
  translatedErrors: {},
  // Defaults from https://github.com/formio/formio.js/blob/
  // bebc2ad73cad138a6de0a8247df47f0085a314cc/src/components/datetime/DateTime.js#L22
  datePicker: {
    showWeeks: true,
    startingDay: 0,
    initDate: '',
    minMode: 'day',
    maxMode: 'year',
    yearRows: 4,
    yearColumns: 5,
    minDate: null,
    maxDate: null,
  },
  openForms: {
    translations: {},
    minDate: {
      mode: '',
      includeToday: null,
      operator: 'add',
      variable: 'now',
      delta: {
        years: null,
        months: null,
        days: null,
      },
    },
    maxDate: {
      mode: '',
      includeToday: null,
      operator: 'add',
      variable: 'now',
      delta: {
        years: null,
        months: null,
        days: null,
      },
    },
  },
  // Registration tab
  registration: {
    attribute: '',
  },
  // Prefill tab
  prefill: {
    plugin: null,
    attribute: null,
    identifierRole: 'main',
  },
};

export default EditForm;
