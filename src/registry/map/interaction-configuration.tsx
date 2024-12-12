import {FormattedMessage, useIntl} from 'react-intl';
import {Checkbox, Panel} from '@/components/formio';

const CircleInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.circle' builder field",
    defaultMessage: 'Whether users are allowed to draw a circle when working with the map',
  });
  return (
    <Checkbox
      name="interactions.circle"
      label={
        <FormattedMessage
          description="Label for 'interactions.circle' builder field"
          defaultMessage="Allow circle interactions"
        />
      }
      tooltip={tooltip}
    />
  );
};

const PolygonInteraction: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'interactions.polygon' builder field",
    defaultMessage: 'Whether users are allowed to draw a polygon when working with the map',
  });
  return (
    <Checkbox
      name="interactions.polygon"
      label={
        <FormattedMessage
          description="Label for 'interactions.polygon' builder field"
          defaultMessage="Allow polygon interactions"
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
    defaultMessage: 'Whether users are allowed to draw a polyline when working with the map',
  });
  return (
    <Checkbox
      name="interactions.polyline"
      label={
        <FormattedMessage
          description="Label for 'interactions.polyline' builder field"
          defaultMessage="Allow polyline interactions"
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
    defaultMessage: 'Whether users are allowed to set a marker when working with the map',
  });
  return (
    <Checkbox
      name="interactions.marker"
      label={
        <FormattedMessage
          description="Label for 'interactions.marker' builder field"
          defaultMessage="Allow marker interactions"
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
    <CircleInteraction />
    <PolygonInteraction />
    <PolylineInteraction />
    <MarkerInteraction />
  </Panel>
);

export default InteractionConfiguration;
