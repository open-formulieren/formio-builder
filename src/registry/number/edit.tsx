import {NumberComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Prefill,
  PresentationConfig,
  Registration,
  SimpleConditional,
  Suffix,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, NumberField, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'number' type component.
 */
const EditForm: EditFormDefinition<NumberComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {hasAnyError} = useErrorChecker<NumberComponentSchema>();
  const {formMode} = useContext(BuilderContext);

  const isAppointmentFormMode = formMode === 'appointment';

  const extraTranslationLabels = {
    prefix: intl.formatMessage({
      description: "Component translations 'prefix' property label",
      defaultMessage: 'Prefix',
    }),
    suffix: intl.formatMessage({
      description: "Component translations 'suffix' property label",
      defaultMessage: 'Suffix (e.g. m²)',
    }),
  };

  Validate.useManageValidatorsTranslations<NumberComponentSchema>(
    isAppointmentFormMode ? ['required'] : ['required', 'min', 'max']
  );

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
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'defaultValue',
            'decimalLimit',
            'allowNegative',
            'suffix'
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
        <Suffix />
        <PresentationConfig />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue />
        <DecimalLimit />
        <AllowNegative />
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <Validate.Min />
        <Validate.Max />
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
        <Translations.ComponentTranslations<NumberComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
            ...(!isAppointmentFormMode && extraTranslationLabels),
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
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  defaultValue: null,
  decimalLimit: undefined,
  allowNegative: false,
  suffix: '',
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
    min: undefined,
    max: undefined,
  },
  translatedErrors: {},
  // Registration tab
  registration: {
    attribute: '',
  },
  prefill: {
    plugin: '',
    attribute: '',
    identifierRole: 'main',
  },
};

const DefaultValue: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });

  return formMode === 'appointment' ? null : (
    <NumberField
      name="defaultValue"
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
    />
  );
};

const DecimalLimit: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'decimalLimit' builder field",
    defaultMessage: 'The maximum number of decimal places.',
  });

  return formMode === 'appointment' ? null : (
    <NumberField
      name="decimalLimit"
      label={
        <FormattedMessage
          description="Label for 'decimalLimit' builder field"
          defaultMessage="Decimal places"
        />
      }
      tooltip={tooltip}
    />
  );
};

const AllowNegative: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'allowNegative' builder field",
    defaultMessage: 'Allow negative values.',
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="allowNegative"
      label={
        <FormattedMessage
          description="Label for 'allowNegative' builder field"
          defaultMessage="Allow negative values"
        />
      }
      tooltip={tooltip}
    />
  );
};

const ComparisonValueInput = NumberField;

export default EditForm;
export {ComparisonValueInput};
