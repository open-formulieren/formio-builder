import {CheckboxComponentSchema} from '@open-formulieren/types';
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
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, TabList, TabPanel, Tabs} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'checkbox' type component.
 */
const EditForm: EditFormDefinition<CheckboxComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {
    values: {description = ''},
    errors,
  } = useFormikContext<CheckboxComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<CheckboxComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Validate.useManageValidatorsTranslations<CheckboxComponentSchema>(['required']);

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
            'defaultValue'
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
        <PresentationConfig />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue description={description} />
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<CheckboxComponentSchema>
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
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  defaultValue: false,
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
  // Registration tab
  registration: {
    attribute: '',
  },
};

interface DefaultValueProps {
  description: string;
}

const DefaultValue: React.FC<DefaultValueProps> = ({description}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });
  return (
    <Checkbox
      name="defaultValue"
      label={<FormattedMessage {...LABELS.defaultValue} />}
      description={description}
      tooltip={tooltip}
    />
  );
};

export default EditForm;
