import {SelectComponentSchema} from '@open-formulieren/types';
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
  Multiple,
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
import {Select, TabList, TabPanel, Tabs} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import {checkIsManualOptions} from './helpers';

/**
 * Form to configure a Formio 'select' type component.
 */
const EditForm: EditFormDefinition<SelectComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, setFieldValue} = useFormikContext<SelectComponentSchema>();
  const {hasAnyError} = useErrorChecker<SelectComponentSchema>();
  const {
    openForms: {dataSrc},
    defaultValue,
    multiple,
  } = values;

  Validate.useManageValidatorsTranslations<SelectComponentSchema>(['required']);

  const isManualOptions = checkIsManualOptions(values);
  const options = isManualOptions ? values.data?.values || [] : [];

  // Ensure that form state is reset if the values source changes.
  useLayoutEffect(() => {
    const emptyDefaultValue = multiple ? [] : '';
    if (dataSrc !== 'variable' || isEqual(defaultValue, emptyDefaultValue)) return;
    setFieldValue('defaultValue', emptyDefaultValue);
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
            'multiple',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'openForms.dataSrc',
            'openForms.itemsExpression',
            'data.values',
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
        <Multiple />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <ValuesConfig<SelectComponentSchema> name="data.values" />
        {isManualOptions && <DefaultValue options={options} multiple={!!values.multiple} />}
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
        <Translations.ComponentTranslations<SelectComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        >
          <ValuesTranslations<SelectComponentSchema> name="data.values" />
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
  // fixed, this is what itemsExpression results in via the backend. Do not confuse with
  // openForms.dataSrc!
  dataSrc: 'values',
  data: {values: [{value: '', label: ''}]},
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
  multiple: boolean;
}

const DefaultValue: React.FC<DefaultValueProps> = ({options, multiple}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultValue' builder field",
    defaultMessage: 'This will be the initial value for this field before user interaction.',
  });

  return (
    <Select
      name="defaultValue"
      options={options}
      label={<FormattedMessage {...LABELS.defaultValue} />}
      tooltip={tooltip}
      isMulti={multiple}
    />
  );
};

export default EditForm;
