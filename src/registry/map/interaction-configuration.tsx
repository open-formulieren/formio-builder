import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox, Panel} from '@/components/formio';

const PolygonInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.polygon' builder field",
    defaultMessage: 'Users can draw shapes (polygons) on the map',
  });
  return (
    <Checkbox
      name="interactions.polygon"
      label={
        <FormattedMessage
          description="Label for 'interactions.polygon' builder field"
          defaultMessage="Polygon"
        />
      }
      tooltip={tooltip}
    />
  );
};

const PolylineInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.polyline' builder field",
    defaultMessage: 'Users can draw straight lines on the map',
  });
  return (
    <Checkbox
      name="interactions.polyline"
      label={
        <FormattedMessage
          description="Label for 'interactions.polyline' builder field"
          defaultMessage="Line"
        />
      }
      tooltip={tooltip}
    />
  );
};

const MarkerInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.marker' builder field",
    defaultMessage: 'Users can set a marker on the map',
  });
  return (
    <Checkbox
      name="interactions.marker"
      label={
        <FormattedMessage
          description="Label for 'interactions.marker' builder field"
          defaultMessage="Marker"
        />
      }
      tooltip={tooltip}
    />
  );
};

const InteractionConfiguration: React.FC = () => (
  <Panel
    title={
      <FormattedMessage
        description="Map interaction configuration panel title"
        defaultMessage="Available drawing shapes"
      />
    }
  >
    <PolygonInteraction />
    <PolylineInteraction />
    <MarkerInteraction />
  </Panel>
);

export default InteractionConfiguration;
