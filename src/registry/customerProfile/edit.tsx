import {CustomerProfileComponentSchema, DigitalAddressType} from '@open-formulieren/types';
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
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, Panel, TabList, TabPanel, Tabs} from '@/components/formio';
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
      'Determines whether Open Forms updates the customer profile when a customer ' +
      'adds a new digital address.',
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

const DigitalAddressTypes: React.FC = () => {
  const intl = useIntl();
  return (
    <Panel
      title={
        <FormattedMessage
          description="Digital address types panel title"
          defaultMessage="Available digital address types"
        />
      }
    >
      <DigitalAddressType
        type="email"
        name="digitalAddressTypes.email"
        label={
          <FormattedMessage
            description="Label for 'digitalAddressTypes.email' builder field"
            defaultMessage="Email"
          />
        }
        tooltip={intl.formatMessage({
          description: "Tooltip for 'digitalAddressTypes.email' builder field",
          defaultMessage: 'Users can enter an email address as communication method',
        })}
      />

      <DigitalAddressType
        type="phoneNumber"
        name="digitalAddressTypes.phoneNumber"
        label={
          <FormattedMessage
            description="Label for 'digitalAddressTypes.phoneNumber' builder field"
            defaultMessage="Phone number"
          />
        }
        tooltip={intl.formatMessage({
          description: "Tooltip for 'digitalAddressTypes.phoneNumber' builder field",
          defaultMessage: 'Users can enter a phone number as communication method',
        })}
      />
    </Panel>
  );
};

interface DigitalAddressTypeProps {
  type: DigitalAddressType;
  name: string;
  label: React.ReactNode;
  tooltip: string;
}

const DigitalAddressType: React.FC<DigitalAddressTypeProps> = ({type, name, label, tooltip}) => {
  const {getFieldProps, setFieldValue} = useFormikContext();
  const {value} = getFieldProps('digitalAddressTypes');

  return (
    <Checkbox
      name={name}
      checked={value.includes(type)}
      label={label}
      onChange={() => {
        const updatedValue = value.includes(type)
          ? value.filter((v: string) => v !== type)
          : [...value, type];
        setFieldValue('digitalAddressTypes', updatedValue);
      }}
      tooltip={tooltip}
    />
  );
};

export default EditForm;
