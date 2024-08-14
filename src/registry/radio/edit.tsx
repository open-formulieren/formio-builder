import {RadioComponentSchema} from '@open-formulieren/types';
import {Option} from '@open-formulieren/types/lib/formio/common';
import {useFormikContext} from 'formik';
import {isEqual} from 'lodash';
import {useLayoutEffect} from 'react';
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
import {Radio, TabList, TabPanel, Tabs} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import {checkIsManualOptions} from './helpers';

/**
 * Form to configure a Formio 'radio' type component.
 */
const EditForm: EditFormDefinition<RadioComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, setFieldValue} = useFormikContext<RadioComponentSchema>();
  const {hasAnyError} = useErrorChecker<RadioComponentSchema>();
  const {
    openForms: {dataSrc},
    defaultValue,
  } = values;

  Validate.useManageValidatorsTranslations<RadioComponentSchema>(['required']);

  const isManualOptions = checkIsManualOptions(values);
  const options = isManualOptions ? values.values || [] : [];

  // Ensure that form state is reset if the values source changes.
  useLayoutEffect(() => {
    if (dataSrc !== 'variable' || isEqual(defaultValue, {})) return;
    setFieldValue('defaultValue', '');
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
        <ValuesConfig<RadioComponentSchema> name="values" withOptionDescription />
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
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <Registration.RegistrationAttributeSelect />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<RadioComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        >
          <ValuesTranslations<RadioComponentSchema> name="values" withOptionDescription />
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
  defaultValue: '',
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
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });

  return (
    <Radio
      name="defaultValue"
      options={options}
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
      isClearable
    />
  );
};

export default EditForm;
