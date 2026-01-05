import {TextareaComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
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
  Placeholder,
  PresentationConfig,
  ReadOnly,
  ShowCharCount,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, NumberField, TabList, TabPanel, Tabs, TextArea} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'textarea' type component.
 */
const EditForm: EditFormDefinition<TextareaComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values} = useFormikContext<TextareaComponentSchema>();
  const {hasAnyError} = useErrorChecker<TextareaComponentSchema>();

  Validate.useManageValidatorsTranslations<TextareaComponentSchema>([
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
            'showCharCount',
            'autoExpand',
            'rows'
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
        <Multiple<TextareaComponentSchema> />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <DefaultValue multiple={!!values.multiple} />
        <AutoComplete />
        <ReadOnly />
        <Placeholder />
        <ShowCharCount />
        <AutoExpand />
        <NumberOfRows />
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

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<TextareaComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
            placeholder: intl.formatMessage(LABELS.placeholder),
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
  multiple: false,
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  defaultValue: '',
  autocomplete: '',
  disabled: false,
  placeholder: '',
  autoExpand: false,
  showCharCount: false,
  rows: 3,
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
    maxLength: 10000,
    pattern: '',
  },
  translatedErrors: {},
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
    <TextArea
      name="defaultValue"
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
      multiple={multiple}
    />
  );
};

const AutoExpand: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'AutoExpand' builder field",
    defaultMessage:
      'This will make the text area auto expand its height as the user is typing into the area.',
  });
  return (
    <Checkbox
      name="autoExpand"
      label={
        <FormattedMessage
          description="Label for 'AutoExpand' builder field"
          defaultMessage="Auto Expand"
        />
      }
      tooltip={tooltip}
    />
  );
};

const NumberOfRows: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'NumberOfRows' builder field",
    defaultMessage: 'The number of rows for this text area.',
  });
  return (
    <NumberField
      name="rows"
      label={
        <FormattedMessage
          description="Label for 'NumberOfRows' builder field"
          defaultMessage="Number of rows"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
