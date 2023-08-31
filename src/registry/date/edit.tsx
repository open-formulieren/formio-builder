import {DateComponentSchema} from '@open-formulieren/types';
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
import {DateField, TabList, TabPanel, Tabs} from '@/components/formio';
import {EditFormDefinition} from '@/registry/types';
import {getErrorNames} from '@/utils/errors';

/**
 * Form to configure a Formio 'date' type component.
 */
const EditForm: EditFormDefinition<DateComponentSchema> = () => {
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {
    values: {multiple = false},
    errors,
  } = useFormikContext<DateComponentSchema>();

  const erroredFields = Object.keys(errors).length ? getErrorNames(errors) : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Translations.useManageTranslations<DateComponentSchema>(['label', 'description', 'tooltip']);
  Validate.useManageValidatorsTranslations<DateComponentSchema>(['required']);

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
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
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
        <Multiple />
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
        {/* TODO advanced validation */}
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
        <Translations.ComponentTranslations />
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
    <DateField
      name="defaultValue"
      label={
        <FormattedMessage
          description="Label for 'defaultValue' builder field"
          defaultMessage="Default Value"
        />
      }
      tooltip={tooltip}
      multiple={multiple}
    />
  );
};

export default EditForm;