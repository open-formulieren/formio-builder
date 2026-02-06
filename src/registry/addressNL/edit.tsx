import {AddressNLComponentSchema} from '@open-formulieren/types';
import {TextField} from 'components/formio';
import {useContext} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

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
import {DataMap, Panel, Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {Select} from '@/components/formio';
import {BuilderContext} from '@/context';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Helper type to extract information from existing types.
 */
type AddressSubComponents = Required<
  Required<Required<AddressNLComponentSchema>['openForms']>['components']
>;
type PostcodeSchema = AddressSubComponents['postcode'];
type CitySchema = AddressSubComponents['city'];

export interface SubcomponentValidationProps {
  prefix: string;
  component: keyof AddressSubComponents;
  label: React.ReactNode;
  tooltip: string;
  placeholder: string;
}

export const SubcomponentValidation: React.FC<SubcomponentValidationProps> = ({
  prefix,
  component,
  label,
  tooltip,
  placeholder,
}) => {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  return (
    <>
      <TextField
        name={`${prefix}.${component}.validate.pattern`}
        label={label}
        tooltip={tooltip}
        placeholder={placeholder}
      />
      <Tabs>
        <TabList>
          {supportedLanguageCodes.map(code => (
            <Tab key={code}>{code.toUpperCase()}</Tab>
          ))}
        </TabList>

        {supportedLanguageCodes.map(code => (
          <TabPanel key={code}>
            <DataMap
              name={`${prefix}.${component}.translatedErrors.${code}`}
              keyLabel={
                <FormattedMessage
                  description="Label for translation of validation error code"
                  defaultMessage="Error code"
                />
              }
              ariaLabelMessage={defineMessage({
                description: 'Accessible label for error message input field',
                defaultMessage: 'Error message for "{key}"',
              })}
              valueComponent={
                <TextField
                  name="message"
                  label={
                    <FormattedMessage
                      description="Label for translation message for validation error code"
                      defaultMessage="Error message"
                    />
                  }
                />
              }
            />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
};

const DeriveAddress = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'DeriveAddress' builder field",
    defaultMessage:
      'When enabled, the street name and city are derived from the entered postcode and house number.',
  });
  return formMode === 'appointment' ? null : (
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

const ColumnsLayout: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const singleColumn = intl.formatMessage({
    description: 'Single column label',
    defaultMessage: 'Single column',
  });
  const doubleColumn = intl.formatMessage({
    description: 'Double column label',
    defaultMessage: 'Double column',
  });

  return formMode === 'appointment' ? null : (
    <Select
      name="layout"
      label={
        <FormattedMessage description="Component property 'layout' label" defaultMessage="Layout" />
      }
      options={[
        {value: 'singleColumn', label: singleColumn},
        {value: 'doubleColumn', label: doubleColumn},
      ]}
      isClearable
    />
  );
};

/**
 * Form to configure a Formio 'address' type component.
 */
const EditForm: EditFormDefinition<AddressNLComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {hasAnyError} = useErrorChecker<AddressNLComponentSchema>();
  const {formMode} = useContext(BuilderContext);

  const isDefaultFormMode = formMode === 'default';

  Validate.useManageValidatorsTranslations<AddressNLComponentSchema>(['required']);

  Validate.useManageValidatorsTranslations<PostcodeSchema>(
    ['pattern'],
    `openForms.components.postcode`
  );
  Validate.useManageValidatorsTranslations<CitySchema>(['pattern'], `openForms.components.city`);

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

        {isDefaultFormMode && (
          <>
            {/* Postcode field validation */}
            <Panel
              title={
                <FormattedMessage
                  description="Title of postcode field validation panel"
                  defaultMessage="Postcode"
                />
              }
              tooltip={intl.formatMessage({
                description: 'Tooltip postcode field validation panel',
                defaultMessage: 'Validation for the postcode field',
              })}
              collapsible
              initialCollapsed
            >
              <SubcomponentValidation
                prefix="openForms.components"
                component="postcode"
                label={
                  <FormattedMessage
                    description="Label for 'validate.pattern' builder field"
                    defaultMessage="Regular expression for postcode"
                  />
                }
                tooltip={intl.formatMessage({
                  description: "Tooltip for 'validate.pattern' builder field",
                  defaultMessage:
                    'The regular expression pattern test that the postcode field value must pass before the form can be submitted.',
                })}
                placeholder={intl.formatMessage({
                  description: "Placeholder for 'validate.pattern' builder field",
                  defaultMessage: 'Regular expression for postcode',
                })}
              />
            </Panel>

            {/* City field validation */}
            <Panel
              title={
                <FormattedMessage
                  description="Title of city field validation panel"
                  defaultMessage="City"
                />
              }
              tooltip={intl.formatMessage({
                description: 'Tooltip city field validation panel',
                defaultMessage: 'Validation for the city field',
              })}
              collapsible
              initialCollapsed
            >
              <SubcomponentValidation
                prefix="openForms.components"
                component="city"
                label={
                  <FormattedMessage
                    description="Label for 'validate.pattern' builder field"
                    defaultMessage="Regular expression for city"
                  />
                }
                tooltip={intl.formatMessage({
                  description: "Tooltip for 'validate.pattern' builder field",
                  defaultMessage:
                    'The regular expression pattern test that the city field value must pass before the form can be submitted.',
                })}
                placeholder={intl.formatMessage({
                  description: "Placeholder for 'validate.pattern' builder field",
                  defaultMessage: 'Regular expression for city',
                })}
              />
            </Panel>
          </>
        )}
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
  openForms: {
    translations: {},
    components: {
      postcode: {
        validate: {pattern: ''},
        translatedErrors: {},
      },
      city: {
        validate: {pattern: ''},
        translatedErrors: {},
      },
    },
  },
};

export default EditForm;
