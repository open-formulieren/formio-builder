import {MapComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useEffect} from 'react';
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
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, TabList, TabPanel, Tabs} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import MapConfiguration from './map-configuration';

/**
 * Form to configure a Formio 'map' type component.
 */
const EditForm: EditFormDefinition<MapComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {values, setValues} = useFormikContext<MapComponentSchema>();
  const {hasAnyError} = useErrorChecker<MapComponentSchema>();

  Validate.useManageValidatorsTranslations<MapComponentSchema>(['required']);

  useEffect(() => {
    const hasLocationSet =
      values.defaultZoom || values?.initialCenter?.lat || values?.initialCenter?.lng;
    if (values.useConfigDefaultMapSettings && hasLocationSet) {
      setValues({...values, defaultZoom: undefined, initialCenter: undefined});
    }
  });

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
            'useConfigDefaultMapSettings',
            'defaultZoom',
            'initialCenter'
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
        <UseConfigDefaultMapSettings />
        {!values.useConfigDefaultMapSettings && <MapConfiguration />}
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
        <Translations.ComponentTranslations<MapComponentSchema>
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
  useConfigDefaultMapSettings: false,
  defaultZoom: undefined,
  initialCenter: {
    lat: undefined,
    lng: undefined,
  },
  defaultValue: null,
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
  // registration tab
  registration: {
    attribute: '',
  },
};

const UseConfigDefaultMapSettings: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'useConfigDefaultMapSettings' builder field",
    defaultMessage:
      'When this is checked, the map component settings configured in the global configuration will be used.',
  });
  return (
    <Checkbox
      name="useConfigDefaultMapSettings"
      label={
        <FormattedMessage
          description="Label for 'useConfigDefaultMapSettings' builder field"
          defaultMessage="Use globally configured map component settings"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
