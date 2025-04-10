import {TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import {FormattedMessage, useIntl} from 'react-intl';

import {NumberField, Panel} from '@/components/formio';

const DefaultZoom: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'defaultZoom' builder field",
    defaultMessage: 'Zoom level for the map when it initially loads.',
  });
  return (
    <NumberField
      name="defaultZoom"
      label={
        <FormattedMessage
          description="Label for 'defaultZoom' builder field"
          defaultMessage="Zoom level"
        />
      }
      tooltip={tooltip}
      step={1}
      min={TILE_LAYER_RD.minZoom}
      max={TILE_LAYER_RD.maxZoom}
    />
  );
};

const Latitude: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'initialCenter.lat' builder field",
    defaultMessage: 'Latitude coordinate of the initial center point of the map.',
  });
  return (
    <NumberField
      name="initialCenter.lat"
      label={
        <FormattedMessage
          description="Label for 'initialCenter.lat' builder field"
          defaultMessage="Latitude"
        />
      }
      description={
        <FormattedMessage
          description="Description for 'initialCenter.lat' builder field"
          defaultMessage="Value in decimal degrees, between -90 and +90."
        />
      }
      tooltip={tooltip}
      placeholder="52.1326332"
      min={-90}
      max={90}
    />
  );
};

const Longitude: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'initialCenter.lng' builder field",
    defaultMessage: 'Longitude coordinate of the initial center point of the map.',
  });
  return (
    <NumberField
      name="initialCenter.lng"
      label={
        <FormattedMessage
          description="Label for 'initialCenter.lng' builder field"
          defaultMessage="Longitude"
        />
      }
      description={
        <FormattedMessage
          description="Description for 'initialCenter.lng' builder field"
          defaultMessage="Value in decimal degrees, between -180 and +180."
        />
      }
      tooltip={tooltip}
      placeholder="5.291266"
      min={-180}
      max={180}
    />
  );
};

const MapConfiguration: React.FC = () => (
  <Panel
    title={
      <FormattedMessage
        description="Map initial focus panel title"
        defaultMessage="Initial focus"
      />
    }
    collapsible
    initialCollapsed
  >
    <DefaultZoom />
    <Latitude />
    <Longitude />
  </Panel>
);

export default MapConfiguration;
