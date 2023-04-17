import {ComponentSchema, ValidateOptions} from 'formiojs';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  AutoComplete,
  ClearOnHide,
  ComponentSelect,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Multiple,
  Placeholder,
  PresentationConfig,
  ReadOnly,
  Registration,
  ShowCharCount,
  SimpleConditional,
  Validate,
} from '@components/builder';
import {
  TextField as BuilderTextField,
  Checkbox,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@components/formio';

import {EditFormDefinition, EditFormProps} from '.';

/**
 * Form to configure a Formio 'textfield' type component.
 */
const TextField: EditFormDefinition<EditFormProps> = () => {
  Validate.useManageValidatorsTranslations(['required', 'maxLength', 'pattern']);
  return (
    <Tabs>
      <TabList>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Basic' tab"
            defaultMessage="Basic"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Location' tab"
            defaultMessage="Location"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Advanced' tab"
            defaultMessage="Advanced"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Validation' tab"
            defaultMessage="Validation"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Registration' tab"
            defaultMessage="Registration"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Prefill' tab"
            defaultMessage="Prefill"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Translations' tab"
            defaultMessage="Translations"
          />
        </Tab>
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key />
        <Description />
        <PresentationConfig />
        <Multiple />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue />
        <AutoComplete />
        <ReadOnly />
        <Placeholder />
        <ShowCharCount />
      </TabPanel>

      {/* Location tab */}
      <TabPanel>
        <DeriveStreetName />
        <DeriveCity />
        <DerivePostcode />
        <DeriveHouseNumber />
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <Validate.MaxLength />
        <Validate.RegexValidation />
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>

      {/* Prefill tab */}
      <TabPanel>Prefill</TabPanel>

      {/* Translations */}
      <TabPanel>Translations</TabPanel>
    </Tabs>
  );
};

interface TextFieldSchema extends ComponentSchema<string> {
  showCharCount: boolean;
  autocomplete: string;
  validate?: ValidateOptions & {
    plugins?: string[];
  };
  showInSummary: boolean;
  showInEmail: boolean;
  showInPDF: boolean;
  isSensitiveData: boolean;
  deriveStreetName: boolean;
  deriveCity: boolean;
  derivePostcode: string;
  deriveHouseNumber: string;
  translatedErrors: {
    [key: string]: {
      [key: string]: string;
    };
  };
  registration: {
    attribute: string;
  };
}

/*
  Making this introspected or declarative doesn't seem advisable, as React is calling
  React.Children and related API's legacy API - this may get removed in future
  versions.

  Explicitly specifying the schema and default values is therefore probbaly best, at
  the cost of some repetition.
 */
const defaultValues: TextFieldSchema = {
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
  isSensitiveData: false,
  defaultValue: '',
  autocomplete: '',
  disabled: false,
  placeholder: '',
  showCharCount: false,
  // location tab
  deriveStreetName: false,
  deriveCity: false,
  derivePostcode: '',
  deriveHouseNumber: '',
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
    maxLength: 1000,
    pattern: '',
  },
  translatedErrors: {},
  registration: {
    attribute: '',
  },
};
TextField.defaultValues = defaultValues;

const DefaultValue: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });
  return (
    <BuilderTextField
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

const DeriveStreetName: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'deriveStreetName' builder field",
    defaultMessage:
      'If the postcode and house number are entered this field will autofill with the street name',
  });
  return (
    <Checkbox
      name="deriveStreetName"
      label={
        <FormattedMessage
          description="Label for 'deriveStreetName' builder field"
          defaultMessage="Derive street name"
        />
      }
      tooltip={tooltip}
    />
  );
};

const DeriveCity: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'deriveCity' builder field",
    defaultMessage:
      'If the postcode and house number are entered this field will autofill with the city',
  });
  return (
    <Checkbox
      name="deriveCity"
      label={
        <FormattedMessage
          description="Label for 'deriveCity' builder field"
          defaultMessage="Derive city"
        />
      }
      tooltip={tooltip}
    />
  );
};

const DerivePostcode: React.FC<{}> = () => (
  <ComponentSelect
    name="derivePostcode"
    label={
      <FormattedMessage
        description="Label for 'derivePostcode' builder field"
        defaultMessage="Postcode component"
      />
    }
    isSearchable
    isClearable
  />
);

const DeriveHouseNumber: React.FC<{}> = () => (
  <ComponentSelect
    name="deriveHouseNumber"
    label={
      <FormattedMessage
        description="Label for 'deriveHouseNumber' builder field"
        defaultMessage="House number component"
      />
    }
    isSearchable
    isClearable
  />
);

export default TextField;
