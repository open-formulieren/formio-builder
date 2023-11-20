import {TimeComponentSchema} from '@open-formulieren/types';
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
  Multiple,
  PresentationConfig,
  ReadOnly,
  Registration,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {TabList, TabPanel, Tabs, TimeField} from '@/components/formio';
import {EditFormDefinition} from '@/registry/types';
import {getErrorNames} from '@/utils/errors';

/**
 * Form to configure a Formio 'date' type component.
 */
const EditForm: EditFormDefinition<TimeComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {
    values: {multiple = false},
    errors,
  } = useFormikContext<TimeComponentSchema>();

  const erroredFields = Object.keys(errors).length ? getErrorNames(errors) : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  Validate.useManageValidatorsTranslations<TimeComponentSchema>([
    'required',
    'minTime',
    'maxTime',
    'invalid_time',
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
            'disabled'
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
        <Multiple<TimeComponentSchema> />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue multiple={multiple} />
        <ReadOnly />
      </TabPanel>
      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>
      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <MinTime />
        <MaxTime />
        <Validate.ValidationErrorTranslations />
      </TabPanel>
      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>
      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<TimeComponentSchema>
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
  format: 'HH:mm',
  validateOn: 'blur',
  inputType: 'text',
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
  disabled: false,
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
    minTime: '',
    maxTime: '',
  },
  translatedErrors: {},
  openForms: {
    translations: {},
  },
  // Registration tab
  registration: {
    attribute: '',
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
    <TimeField
      name="defaultValue"
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
      multiple={multiple}
    />
  );
};

const MinTime: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.minTime' builder field",
    defaultMessage: 'The earliest possible value that can be entered.',
  });
  return (
    <TimeField
      name="validate.minTime"
      label={
        <FormattedMessage
          description="Label for 'validate.minTime' builder field"
          defaultMessage="Minimum time"
        />
      }
      tooltip={tooltip}
    />
  );
};

const MaxTime: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.maxTime' builder field",
    defaultMessage: 'The latest possible value that can be entered.',
  });
  return (
    <TimeField
      name="validate.maxTime"
      label={
        <FormattedMessage
          description="Label for 'validate.maxTime' builder field"
          defaultMessage="Maximum time"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
