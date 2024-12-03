import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox, Panel} from '@/components/formio';

const PolygonInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.polygon' builder field",
    defaultMessage: 'Allowing users to draw a polygon when using the map component',
  });
  return (
    <Checkbox
      name="interactions.polygon"
      label={
        <FormattedMessage
          description="Label for 'interactions.polygon' builder field"
          defaultMessage="Polygon interactions"
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
    defaultMessage: 'Allowing users to draw a line when using the map component',
  });
  return (
    <Checkbox
      name="interactions.polyline"
      label={
        <FormattedMessage
          description="Label for 'interactions.polyline' builder field"
          defaultMessage="Line interactions"
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
    defaultMessage: 'Allowing users to set a marker when using the map component',
  });
  return (
    <Checkbox
      name="interactions.marker"
      label={
        <FormattedMessage
          description="Label for 'interactions.marker' builder field"
          defaultMessage="Marker interactions"
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
        description="Interaction configuration panel title"
        defaultMessage="Available map interactions"
      />
    }
  >
    <PolygonInteraction />
    <PolylineInteraction />
    <MarkerInteraction />
  </Panel>
);

export default InteractionConfiguration;
