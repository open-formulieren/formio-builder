import {Option, SelectboxesComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {isEqual} from 'lodash';
import {useContext, useLayoutEffect} from 'react';
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
  ValuesConfig,
  ValuesTranslations,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {NumberField, SelectBoxes, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import {checkIsManualOptions} from './helpers';

/**
 * Form to configure a Formio 'selectboxes' type component.
 */
const EditForm: EditFormDefinition<SelectboxesComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, setFieldValue} = useFormikContext<SelectboxesComponentSchema>();
  const {hasAnyError} = useErrorChecker<SelectboxesComponentSchema>();
  const {formMode} = useContext(BuilderContext);

  const {
    openForms: {dataSrc},
    defaultValue,
  } = values;
  const isAppointmentFormMode = formMode === 'appointment';

  Validate.useManageValidatorsTranslations<SelectboxesComponentSchema>(
    isAppointmentFormMode ? ['required'] : ['required', 'minSelectedCount', 'maxSelectedCount']
  );

  const isManualOptions = checkIsManualOptions(values);
  const options = isManualOptions ? values.values || [] : [];

  // Ensure that form state is reset if the values source changes.
  useLayoutEffect(() => {
    if (dataSrc !== 'variable' || isEqual(defaultValue, {})) return;
    setFieldValue('defaultValue', {});
  }, [dataSrc]);

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
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'openForms.dataSrc',
            'openForms.itemsExpression',
            'values',
            'defaultValue'
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
        <ValuesConfig<SelectboxesComponentSchema> name="values" withOptionDescription />
        {isManualOptions && <DefaultValue options={options} />}
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.ValidatorPluginSelect />
        <MinSelectedCheckboxes />
        <MaxSelectedCheckboxes />
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<SelectboxesComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        >
          <ValuesTranslations<SelectboxesComponentSchema> name="values" withOptionDescription />
        </Translations.ComponentTranslations>
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
  isSensitiveData: false,
  openForms: {
    dataSrc: 'manual',
    translations: {},
  },
  values: [{value: '', label: ''}],
  // TODO: check that the initial values are set based on component.values
  // TODO: at some point we can allow an itemsExpression for this too
  defaultValue: {},
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

interface DefaultValueProps {
  options: Option[];
}

const DefaultValue: React.FC<DefaultValueProps> = ({options}) => {
  const intl = useIntl();
  const {getFieldProps, setFieldValue} = useFormikContext<SelectboxesComponentSchema>();
  const {value = {}} = getFieldProps<SelectboxesComponentSchema['defaultValue'] | undefined>(
    'defaultValue'
  );
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });

  // This layout effect uses a non-primitive dependency. It works *because of Formik*
  // implementation details, wich uses refs internally and changes the identity of the
  // options field only when mutations are made to it (add, change items, re-ordering...)
  useLayoutEffect(() => {
    const optionValues = options.map(opt => opt.value);
    const defaultValueKeys = new Set(Object.keys(value));

    // if all the option values are present in the default value map, there is nothing
    // to do and we bail early to prevent further form state mutations.
    if (defaultValueKeys === new Set(optionValues)) return;

    // If no default value is present for an option, make it explicitly false.
    // Checking/unchecking persist the state either way, so we only need to do this once
    // if an option is present yet.
    //
    // Additionally, we start with an empty object so that we can drop/discard any default
    // values for options that were removed.
    const explicitDefaults: SelectboxesComponentSchema['defaultValue'] = {};
    optionValues.forEach(optionValue => {
      // if a value is specified already in the form state, use it, otherwise default to "unchecked".
      const defaultForOption = value.hasOwnProperty(optionValue) ? value[optionValue] : false;
      explicitDefaults[optionValue] = defaultForOption;
    });

    setFieldValue('defaultValue', explicitDefaults);
  }, [options]);

  return formMode === 'appointment' ? null : (
    <SelectBoxes
      name="defaultValue"
      options={options}
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
    />
  );
};

const MinSelectedCheckboxes: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.minSelectedCount' builder field",
    defaultMessage: 'If specified, the user must check at least this many options.',
  });

  return formMode === 'appointment' ? null : (
    <NumberField
      name="validate.minSelectedCount"
      label={
        <FormattedMessage
          description="Label for 'validate.minSelectedCount' builder field"
          defaultMessage="Minimum selected checkboxes"
        />
      }
      placeholder={intl.formatMessage({
        description: "Placeholder for 'validate.minSelectedCount' builder field",
        defaultMessage: 'Minimum selected checkboxes (e.g. 1)',
      })}
      tooltip={tooltip}
      min={1}
      step={1}
    />
  );
};

const MaxSelectedCheckboxes: React.FC = () => {
  const intl = useIntl();
  const {formMode} = useContext(BuilderContext);

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.maxSelectedCount' builder field",
    defaultMessage: 'If specified, the user must check at most this many options.',
  });

  return formMode === 'appointment' ? null : (
    <NumberField
      name="validate.maxSelectedCount"
      label={
        <FormattedMessage
          description="Label for 'validate.maxSelectedCount' builder field"
          defaultMessage="Maximum selected checkboxes"
        />
      }
      placeholder={intl.formatMessage({
        description: "Placeholder for 'validate.maxSelectedCount' builder field",
        defaultMessage: 'Maximum selected checkboxes (e.g. 1)',
      })}
      tooltip={tooltip}
      min={1}
      step={1}
    />
  );
};

export default EditForm;
