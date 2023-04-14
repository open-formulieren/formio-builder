import {ExtendedComponentSchema} from 'formiojs';
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
        <Validate.MaxLength />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>Registration</TabPanel>

      {/* Prefill tab */}
      <TabPanel>Prefill</TabPanel>

      {/* Translations */}
      <TabPanel>Translations</TabPanel>
    </Tabs>
  );
};

/*
  TODO: find a way to make this declarative - a function introspecting the entire tree
  and extracting this from 'Field' components perhaps?

  Maybe a component can set an editForm.defaultValue prop? It should inspect the name
  attribute though and do deep assignment using dot-syntax.
 */
const defaultValues: ExtendedComponentSchema<string> = {
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
  validate: {
    required: false,
  },
};
TextField.defaultValues = defaultValues;

const DefaultValue: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Default Value' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });
  return (
    <BuilderTextField
      name="defaultValue"
      label={
        <FormattedMessage
          description="Component property 'Default value' label"
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
        description="Label for '' builder field"
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
        description="Label for '' builder field"
        defaultMessage="House number component"
      />
    }
    isSearchable
    isClearable
  />
);

export default TextField;
