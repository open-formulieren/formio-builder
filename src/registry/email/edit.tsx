import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  AutoComplete,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Multiple,
  PresentationConfig,
  Registration,
  SimpleConditional,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {Checkbox, Tab, TabList, TabPanel, Tabs, TextField} from '@/components/formio';
import {OpenFormsComponentSchemaBase} from '@/types/schemas';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition, EditFormProps} from '..';

interface EmailSchema extends OpenFormsComponentSchemaBase<string> {
  autocomplete: string;
  confirmationRecipient: boolean;
  inputType: 'email';
}

/**
 * Form to configure a Formio 'textfield' type component.
 */
const Email: EditFormDefinition<EditFormProps> = () => {
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, errors} = useFormikContext<EmailSchema>();

  const erroredFields = Object.keys(errors).length ? getErrorNames<EmailSchema>(errors) : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Translations.useManageTranslations<EmailSchema>(['label', 'description', 'defaultValue']);
  Validate.useManageValidatorsTranslations(['required']);
  return (
    <Tabs>
      <TabList>
        <Tab
          hasErrors={hasAnyError(
            'label',
            'key',
            'description',
            'showInSummary',
            'showInEmail',
            'showInPDF',
            'multiple',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'defaultValue',
            'autocomplete'
          )}
        >
          <FormattedMessage
            description="Component edit form tab title for 'Basic' tab"
            defaultMessage="Basic"
          />
        </Tab>
        <Tab hasErrors={hasAnyError('conditional')}>
          <FormattedMessage
            description="Component edit form tab title for 'Advanced' tab"
            defaultMessage="Advanced"
          />
        </Tab>
        <Tab hasErrors={hasAnyError('validate')}>
          <FormattedMessage
            description="Component edit form tab title for 'Validation' tab"
            defaultMessage="Validation"
          />
        </Tab>
        <Tab hasErrors={hasAnyError('registration')}>
          <FormattedMessage
            description="Component edit form tab title for 'Registration' tab"
            defaultMessage="Registration"
          />
        </Tab>
        <Tab hasErrors={hasAnyError('openForms.translations')}>
          <FormattedMessage
            description="Component edit form tab title for 'Translations' tab"
            defaultMessage="Translations"
          />
        </Tab>
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <PresentationConfig />
        <Multiple />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue multiple={!!values.multiple} />
        <AutoComplete />
        <IsConfirmationRecipient />
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
        <Translations.ComponentTranslations />
      </TabPanel>
    </Tabs>
  );
};

const defaultValues: EmailSchema = {
  // basic tab
  label: '',
  key: '',
  description: '',
  showInSummary: true,
  showInEmail: false,
  showInPDF: true,
  multiple: false,
  hidden: false,
  clearOnHide: true,
  isSensitiveData: true,
  defaultValue: '',
  autocomplete: 'email',
  confirmationRecipient: false,
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
  registration: {
    attribute: '',
  },
  // fixed but not editable
  validateOn: 'blur',
  inputType: 'email',
};
Email.defaultValues = defaultValues;

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
    <TextField
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

const IsConfirmationRecipient: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'confirmationRecipient' builder field",
    defaultMessage: 'Email-address in this field will receive the confirmation email.',
  });
  return (
    <Checkbox
      name="confirmationRecipient"
      label={
        <FormattedMessage
          description="Label for 'confirmationRecipient' builder field"
          defaultMessage="Receives confirmation email"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default Email;
