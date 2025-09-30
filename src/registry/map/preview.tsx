import {CRS_RD, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import type {MapComponentSchema} from '@open-formulieren/types';
import type {DrawEvents, FeatureGroup as LeafletFeatureGroup} from 'leaflet';
import {useContext, useLayoutEffect, useRef} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {
  FeatureGroup,
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
  useMap,
} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import useAsync from 'react-use/esm/useAsync';

import Loader from '@/components/builder/loader';
import {Component, Description} from '@/components/formio';
import {BuilderContext} from '@/context';
import {ComponentPreviewProps} from '@/registry/types';

import zodSchema from './edit-validation';
import './previews.scss';
import type {OverlayWithoutUrl} from './types';

interface MapViewProps {
  lat: number;
  lng: number;
  zoom: number;
}

const MapView: React.FC<MapViewProps> = ({lat, lng, zoom}) => {
  const map = useMap();
  useLayoutEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);
  return null;
};

interface TileLayerControlProps {
  overlay: OverlayWithoutUrl;
  url: string;
  index: number;
}

const WMSTileLayerControl: React.FC<TileLayerControlProps> = ({index, overlay, url}) => (
  <LayersControl.Overlay name={overlay.label} key={`${index}-${overlay.label}`} checked>
    <WMSTileLayer
      url={url}
      params={{
        format: 'image/png',
        layers: overlay.layers.join(','),
        transparent: true,
      }}
    />
  </LayersControl.Overlay>
);

const overlayLayerControls: Partial<
  Record<OverlayWithoutUrl['type'], React.ElementType<TileLayerControlProps>>
> = {
  wms: WMSTileLayerControl,
};

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
    tileLayerIdentifier,
    interactions,
    overlays,
  } = component;
  const intl = useIntl();
  const builderContext = useContext(BuilderContext);
  const {getMapTileLayers, getMapOverlayTileLayers} = builderContext;
  const featureGroupRef = useRef<LeafletFeatureGroup>(null);
  const {
    value: [tileLayers, overlayTileLayersData] = [[], []],
    loading,
    error,
  } = useAsync(async () => await Promise.all([getMapTileLayers(), getMapOverlayTileLayers()]), []);
  if (error) {
    throw error;
  }
  if (loading) {
    return <Loader />;
  }

  const {success: isValidConfiguration} = zodSchema({intl, builderContext}).safeParse(component);

  if (!isValidConfiguration) {
    return (
      <FormattedMessage
        description="Map preview: invalid config message"
        defaultMessage="The map configuration is not valid, so we can't show a preview. Fix the validation errors in the component configuration."
      />
    );
  }

  // We should only display overlay tile layers that have an uuid.
  const overlaysToDisplay = overlays?.filter(layer => !!layer?.uuid);

  const {required = false} = validate;
  const {lat = 52.1326332, lng = 5.291266} = initialCenter;
  const zoom = defaultZoom ?? 8;

  const overlayUrl = (overlay: OverlayWithoutUrl): string | null => {
    return overlayTileLayersData.find(tileLayer => tileLayer.uuid === overlay.uuid)?.url ?? '';
  };

  const tileLayerUrl = (): string => {
    // Try to find the url of the chosen tile layer. If it is found, return the url,
    // else return the default tile layer url.
    return (
      tileLayers.find(tileLayer => tileLayer.identifier === tileLayerIdentifier)?.url ??
      TILE_LAYER_RD.url
    );
  };

  const onFeatureCreate = (event: DrawEvents.Created) => {
    featureGroupRef.current?.clearLayers();
    featureGroupRef.current?.addLayer(event.layer);
  };

  const editable = Object.values(interactions || {}).find(interaction => interaction);
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
        zoom={zoom}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minBlockSize: '400px',
        }}
      >
        <TileLayer {...TILE_LAYER_RD} url={tileLayerUrl()} />
        {overlaysToDisplay?.length && (
          <LayersControl position="topright">
            {overlaysToDisplay.map((layer: OverlayWithoutUrl, index: number) => {
              const Component = overlayLayerControls[layer.type];
              const url = overlayUrl(layer);
              if (!url) {
                return null;
              }
              return Component ? (
                <Component index={index} key={index} url={url} overlay={layer} />
              ) : null;
            })}
          </LayersControl>
        )}

        <FeatureGroup ref={featureGroupRef}>
          {editable && (
            <EditControl
              position="topright"
              onCreated={onFeatureCreate}
              edit={{
                edit: false,
              }}
              draw={{
                rectangle: false,
                circle: false,
                polyline: !!interactions?.polyline,
                polygon: !!interactions?.polygon,
                marker: !!interactions?.marker,
                circlemarker: false,
              }}
            />
          )}
        </FeatureGroup>
        <MapView lat={lat} lng={lng} zoom={zoom} />
      </MapContainer>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
