import {CosignV2ComponentSchema} from '@open-formulieren/types';
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
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'cosign' (cosign v2) type component.
 */
const EditForm: EditFormDefinition<CosignV2ComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {hasAnyError} = useErrorChecker<CosignV2ComponentSchema>();
  Validate.useManageValidatorsTranslations<CosignV2ComponentSchema>(['required']);
  return (
    <Tabs>
      <TabList>
        <BuilderTabs.Basic
          hasErrors={hasAnyError(
            'label',
            'key',
            'tooltip',
            'description',
            'showInSummary',
            'showInEmail',
            'showInPDF',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'defaultValue',
            'checkBsn'
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
        <CheckBSN />
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
        <Translations.ComponentTranslations<CosignV2ComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
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
  isSensitiveData: true,
  checkBsn: false,
  defaultValue: {
    email: '',
    bsn: '',
  },
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
  // registration tab
  registration: {
    attribute: '',
  },
  // translations tab
  translatedErrors: {},
};

const CheckBSN: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'checkBsn' builder field",
    defaultMessage:
      'Should the user be asked to also enter the BSN of the person that will cosign?',
  });

  return (
    <Checkbox
      name="checkBsn"
      label={
        <FormattedMessage
          description="Label for 'checkBsn' builder field"
          defaultMessage="Check BSN"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
