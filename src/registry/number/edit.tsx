import {NumberComponentSchema} from '@open-formulieren/types';
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
  PresentationConfig,
  Registration,
  SimpleConditional,
  Suffix,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {Checkbox, NumberField, TabList, TabPanel, Tabs} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'number' type component.
 */
const EditForm: EditFormDefinition<NumberComponentSchema> = () => {
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {errors} = useFormikContext<NumberComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<NumberComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Translations.useManageTranslations<NumberComponentSchema>([
    'label',
    'description',
    'tooltip',
    // XXX: enable translation in backend? Need to be careful though, HTML escaping
    // will mess up any <sup>/<sub> tags that *are* supported.
    // 'suffix',
  ]);
  Validate.useManageValidatorsTranslations<NumberComponentSchema>(['required', 'min', 'max']);

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
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  defaultValue: undefined,
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
};

const DefaultValue: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });
  return (
    <NumberField
      name="defaultValue"
      label={
        <FormattedMessage
          description="Label for 'defaultValue' builder field"
          defaultMessage="Default Value"
        />
      }
      tooltip={tooltip}
    />
  );
};

const DecimalLimit: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'decimalLimit' builder field",
    defaultMessage: 'The maximum number of decimal places.',
  });
  return (
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
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'allowNegative' builder field",
    defaultMessage: 'Allow negative values.',
  });
  return (
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

export default EditForm;
