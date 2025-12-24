import {TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import {useFormikContext} from 'formik';
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
      description={
        <FormattedMessage
          description="Description for 'defaultZoom' builder field"
          defaultMessage="Value in whole numbers, between {minZoom} and {maxZoom}."
          values={{
            minZoom: TILE_LAYER_RD.minZoom,
            maxZoom: TILE_LAYER_RD.maxZoom,
          }}
        />
      }
      tooltip={tooltip}
      step={1}
      min={TILE_LAYER_RD.minZoom}
      max={TILE_LAYER_RD.maxZoom}
    />
  );
};

/**
 * Calculate the step size for coordinate fields based on the zoom level.
 *
 * This roughly translates to:
 * zoomLevel 1: step size 0.5
 * zoomLevel 4: step size 0.0625
 * zoomLevel 8: step size 0.0039
 * zoomLevel 12: step size 0.00024
 */
const useCoordinateFieldStep = () => {
  const {getFieldMeta} = useFormikContext();
  const {value: zoomLevel} = getFieldMeta<number | null>('defaultZoom');

  return Math.pow(2, -(zoomLevel ?? 8));
};

const Latitude: React.FC = () => {
  const fieldStep = useCoordinateFieldStep();
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
          defaultMessage="Value in decimal degrees, between 50.5 and 54."
        />
      }
      tooltip={tooltip}
      placeholder="52.1326332"
      min={50.5}
      max={54}
      step={fieldStep}
    />
  );
};

const Longitude: React.FC = () => {
  const fieldStep = useCoordinateFieldStep();
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
          defaultMessage="Value in decimal degrees, between 3 and 7.5."
        />
      }
      tooltip={tooltip}
      placeholder="5.291266"
      min={3}
      max={7.5}
      step={fieldStep}
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
