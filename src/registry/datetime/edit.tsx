import {DateTimeComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Multiple,
  Prefill,
  PresentationConfig,
  ReadOnly,
  Registration,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {DateTimeField, TabList, TabPanel, Tabs} from '@/components/formio';
import {EditFormDefinition} from '@/registry/types';
import {getErrorNames} from '@/utils/errors';

import DateTimeConstraintValidation from './validation';

/**
 * Form to configure a Formio 'date' type component.
 */
const EditForm: EditFormDefinition<DateTimeComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {
    values: {multiple = false},
    errors,
  } = useFormikContext<DateTimeComponentSchema>();

  const erroredFields = Object.keys(errors).length ? getErrorNames(errors) : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Validate.useManageValidatorsTranslations<DateTimeComponentSchema>(['required']);

  return (
    <Tabs>
      <TabList>
        <BuilderTabs.Basic
          hasErrors={hasAnyError(
            'label',
            'key',
            'description',
            'tooltip',
            'showInSummary',
            'showInEmail',
            'showInPDF',
            'multiple',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'defaultValue',
            'disabled'
          )}
        />
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Validation
          hasErrors={hasAnyError('validate', 'openForms.minDate', 'openForms.maxDate')}
        />
        <BuilderTabs.Registration hasErrors={hasAnyError('registration')} />
        <BuilderTabs.Prefill hasErrors={hasAnyError('prefill')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <PresentationConfig />
        <Multiple<DateTimeComponentSchema> />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue multiple={multiple} />
        <ReadOnly />
      </TabPanel>
      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>
      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <DateTimeConstraintValidation constraint="minDate" />
        <DateTimeConstraintValidation constraint="maxDate" />
        <Validate.ValidationErrorTranslations />
      </TabPanel>
      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>
      {/* Prefill tab */}
      <TabPanel>
        <Prefill.PrefillConfiguration />
      </TabPanel>
      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<DateTimeComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        />
      </TabPanel>
    </Tabs>
  );
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
    minDate: {mode: ''},
    maxDate: {mode: ''},
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

interface DefaultValueProps {
  multiple: boolean;
}

const DefaultValue: React.FC<DefaultValueProps> = ({multiple}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });
  return (
    <DateTimeField
      name="defaultValue"
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
      multiple={multiple}
    />
  );
};

export default EditForm;
