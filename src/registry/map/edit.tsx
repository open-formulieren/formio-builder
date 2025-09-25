import {MapComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext, useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

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
import {Checkbox, Select, Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import InteractionConfiguration from '@/registry/map/interaction-configuration';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import MapConfiguration from './map-configuration';
import Overlays from './overlays';

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
      values.defaultZoom ||
      values?.initialCenter ||
      values?.initialCenter?.lat ||
      values?.initialCenter?.lng;
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
            'isSensitiveData'
          )}
        />
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
        <Tab
          hasErrors={hasAnyError(
            'useConfigDefaultMapSettings',
            'defaultZoom',
            'initialCenter',
            'interactions'
          )}
        >
          <FormattedMessage
            description="Component edit form tab title for 'Map settings' tab"
            defaultMessage="Map settings"
          />
        </Tab>
        <Tab hasErrors={hasAnyError('tileLayerIdentifier', 'overlays')}>
          <FormattedMessage
            description="Component edit form tab title for 'Layers' tab"
            defaultMessage="Layers"
          />
        </Tab>
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

      {/* Map settings tab */}
      <TabPanel>
        <InteractionConfiguration />
        <UseConfigDefaultMapSettings />
        {!values.useConfigDefaultMapSettings && <MapConfiguration />}
      </TabPanel>

      {/* Map layers tab */}
      <TabPanel>
        <TileLayer />
        <Overlays />
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
  tileLayerIdentifier: undefined,
  interactions: {
    polygon: false,
    polyline: false,
    marker: true,
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

const TileLayer: React.FC = () => {
  const {getMapTileLayers} = useContext(BuilderContext);
  const intl = useIntl();
  const {value: options, loading, error} = useAsync(async () => await getMapTileLayers(), []);
  if (error) {
    throw error;
  }

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'tileLayerIdentifier' builder field",
    defaultMessage:
      'Optionally specify an alternative background layer for the map component. ' +
      'This affects the map style at particular coordinates and zoom levels.',
  });
  return (
    <Select
      name="tileLayerIdentifier"
      label={
        <FormattedMessage
          description="Label for 'tileLayerIdentifier' builder field"
          defaultMessage="Background"
        />
      }
      isClearable
      tooltip={tooltip}
      isLoading={loading}
      options={options?.map(tileLayer => ({
        label: tileLayer.label,
        value: tileLayer.identifier,
      }))}
    />
  );
};

export default EditForm;
