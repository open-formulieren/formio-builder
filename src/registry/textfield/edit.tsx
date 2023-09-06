import {TextFieldComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  AutoComplete,
  BuilderTabs,
  ClearOnHide,
  ComponentSelect,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Multiple,
  Placeholder,
  Prefill,
  PresentationConfig,
  ReadOnly,
  Registration,
  ShowCharCount,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {Checkbox, Tab, TabList, TabPanel, Tabs, TextField} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'textfield' type component.
 */
const EditForm: EditFormDefinition<TextFieldComponentSchema> = () => {
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, errors} = useFormikContext<TextFieldComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<TextFieldComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Translations.useManageTranslations<TextFieldComponentSchema>([
    'label',
    'description',
    'tooltip',
    'defaultValue',
    'placeholder',
  ]);
  Validate.useManageValidatorsTranslations<TextFieldComponentSchema>([
    'required',
    'maxLength',
    'pattern',
  ]);
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
            'autocomplete',
            'disabled',
            'placeholder',
            'showCharCount'
          )}
        />
        <Tab
          hasErrors={hasAnyError(
            'deriveStreetName',
            'deriveCity',
            'derivePostcode',
            'deriveHouseNumber'
          )}
        >
          <FormattedMessage
            description="Component edit form tab title for 'Location' tab"
            defaultMessage="Location"
          />
        </Tab>
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
        <BuilderTabs.Registration hasErrors={hasAnyError('registration')} />
        <BuilderTabs.Prefill hasErrors={hasAnyError('prefill')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <PresentationConfig />
        <Multiple<TextFieldComponentSchema> />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue multiple={!!values.multiple} />
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
      <TabPanel>
        <Prefill.PrefillConfiguration />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations />
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
  prefill: {
    plugin: null,
    attribute: null,
    identifierRole: 'main',
  },
};

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

export default EditForm;
