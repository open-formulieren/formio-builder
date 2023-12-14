import {CRS_RD, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import {MapComponentSchema} from '@open-formulieren/types';
import {MapContainer, TileLayer} from 'react-leaflet';

import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio map component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<MapComponentSchema>> = ({component}) => {
  const {
    key,
    label,
    description,
    tooltip,
    validate = {},
    defaultZoom,
    initialCenter = {},
  } = component;
  const {required = false} = validate;
  const {lat = 52.1326332, lng = 5.291266} = initialCenter;

  return (
    <Component
      type={component.type}
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      <MapContainer
        crs={CRS_RD}
        attributionControl
        center={[lat, lng]}
        zoom={defaultZoom ?? 8}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minBlockSize: '400px',
        }}
      >
        <TileLayer {...TILE_LAYER_RD} />
      </MapContainer>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
