import type {CustomerProfileComponentSchema} from '@open-formulieren/types';
import {DigitalAddressType} from '@open-formulieren/types/dist/components/customerProfile';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  PresentationConfig,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, Select, TabList, TabPanel, Tabs} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'customerProfile' type component.
 */
const EditForm: EditFormDefinition<CustomerProfileComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {hasAnyError} = useErrorChecker<CustomerProfileComponentSchema>();

  Validate.useManageValidatorsTranslations<CustomerProfileComponentSchema>(['required']);
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
            'showInPDF',
            'shouldUpdateCustomerData',
            'digitalAddressTypes'
          )}
        />
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <PresentationConfig />
        <DigitalAddressTypes />
        <ShouldUpdateCustomerData />
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
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<CustomerProfileComponentSchema>
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
  hidden: false,
  clearOnHide: true,
  isSensitiveData: true,
  shouldUpdateCustomerData: true,
  digitalAddressTypes: ['email', 'phoneNumber'],
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
};

const ShouldUpdateCustomerData: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'shouldUpdateCustomerData' builder field",
    defaultMessage:
      'When this is checked, Open Forms automatically updates the customer profile ' +
      'when a digital address is added.',
  });
  return (
    <Checkbox
      name="shouldUpdateCustomerData"
      label={
        <FormattedMessage
          description="Label for 'shouldUpdateCustomerData' builder field"
          defaultMessage="Open Forms should update customer data after submission"
        />
      }
      tooltip={tooltip}
    />
  );
};

const DigitalAddressTypeOptionLabels = defineMessages<DigitalAddressType>({
  email: {
    description: "Label for 'email' option in 'digitalAddressTypes' select field",
    defaultMessage: 'Email',
  },
  phoneNumber: {
    description: "Label for 'phoneNumber' option in 'digitalAddressTypes' select field",
    defaultMessage: 'Phone number',
  },
});

const DigitalAddressTypes: React.FC = () => {
  const intl = useIntl();
  const options = Object.entries(DigitalAddressTypeOptionLabels).map(([value, label]) => ({
    value,
    label: intl.formatMessage(label),
  }));

  return (
    <Select
      name="digitalAddressTypes"
      label={
        <FormattedMessage
          description="Label for 'digitalAddressTypes' builder field"
          defaultMessage="Available digital address types"
        />
      }
      tooltip={intl.formatMessage({
        description: "Tooltip for 'digitalAddressTypes' builder field",
        defaultMessage: 'Digital address types a user can be contacted on.',
      })}
      isMulti
      required
      options={options}
    />
  );
};

export default EditForm;
