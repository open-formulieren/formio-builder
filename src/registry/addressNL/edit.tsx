import {AddressNLComponentSchema} from '@open-formulieren/types';
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
import {Checkbox} from '@/components/formio';
import {TabList, TabPanel, Tabs} from '@/components/formio';
import {Select} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

const DeriveAddress = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'DeriveAddress' builder field",
    defaultMessage:
      'When enabled, the street name and city are derived from the entered postcode and house number.',
  });
  return (
    <Checkbox
      name="deriveAddress"
      label={
        <FormattedMessage
          description="Label for 'DeriveAddress' builder field"
          defaultMessage="Derive address"
        />
      }
      tooltip={tooltip}
    />
  );
};

const ColumnsLayout: React.FC = () => (
  <Select
    name="layout"
    label={
      <FormattedMessage description="Component property 'layout' label" defaultMessage="Layout" />
    }
    options={[
      {value: 'singleColumn', label: 'Single column'},
      {value: 'doubleColumn', label: 'Double column'},
    ]}
    isClearable
    defaultValue={{value: 'doubleColumn', label: 'Double column'}}
  />
);

/**
 * Form to configure a Formio 'address' type component.
 */
const EditForm: EditFormDefinition<AddressNLComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {hasAnyError} = useErrorChecker<AddressNLComponentSchema>();
  Validate.useManageValidatorsTranslations<AddressNLComponentSchema>(['required']);
  return (
    <Tabs>
      <TabList>
        <BuilderTabs.Basic
          hasErrors={hasAnyError(
            'label',
            'key',
            'description',
            'tooltip',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'showInSummary',
            'showInEmail',
            'showInPDF'
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
        <ColumnsLayout />
        <DeriveAddress />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
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
        <Translations.ComponentTranslations<AddressNLComponentSchema>
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

/*
  Making this introspected or declarative doesn't seem advisable, as React is calling
  React.Children and related API's legacy API - this may get removed in future
  versions.

  Explicitly specifying the schema and default values is therefore probbaly best, at
  the cost of some repetition.
 */
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
  deriveAddress: false,
  layout: 'doubleColumn',
  defaultValue: {
    postcode: '',
    houseNumber: '',
    houseLetter: '',
    houseNumberAddition: '',
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
  translatedErrors: {},
  registration: {
    attribute: '',
  },
};

export default EditForm;
