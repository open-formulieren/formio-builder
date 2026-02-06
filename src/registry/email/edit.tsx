import {EmailComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  AutoComplete,
  BuilderTabs,
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
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, TabList, TabPanel, Tabs, TextField} from '@/components/formio';
import {BuilderContext} from '@/context';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'email' type component.
 */
const EditForm: EditFormDefinition<EmailComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values} = useFormikContext<EmailComponentSchema>();

  const {hasAnyError} = useErrorChecker<EmailComponentSchema>();

  Validate.useManageValidatorsTranslations<EmailComponentSchema>(['required']);
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
            'autocomplete'
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
        <Multiple<EmailComponentSchema> />
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
        <RequireVerification />
        <Validate.ValidatorPluginSelect />
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<EmailComponentSchema>
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
  // openForms extensions
  openForms: {
    translations: {},
    requireVerification: false,
  },
};

interface DefaultValueProps {
  multiple: boolean;
}

const DefaultValue: React.FC<DefaultValueProps> = ({multiple}) => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });

  return formMode === 'appointment' ? null : (
    <TextField
      name="defaultValue"
      type="email"
      label={intl.formatMessage(LABELS.defaultValue)}
      tooltip={tooltip}
      multiple={multiple}
    />
  );
};

const IsConfirmationRecipient: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'confirmationRecipient' builder field",
    defaultMessage: 'Email-address in this field will receive the confirmation email.',
  });

  return formMode === 'appointment' ? null : (
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

const RequireVerification = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for email 'openForms.requireVerification' builder field",
    defaultMessage: `When email address verification is enabled, the user must verify
    their email address before they can submit the form. This proves the email address
    exists and that they have access to the account.`,
  });

  return formMode === 'appointment' ? null : (
    <Checkbox
      name="openForms.requireVerification"
      label={
        <FormattedMessage
          description="Label for email 'openForms.requireVerification' builder field"
          defaultMessage="Require verification"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
