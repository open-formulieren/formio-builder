import {CRS_RD, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import {MapComponentSchema} from '@open-formulieren/types';
import type {FeatureGroup as LeafletFeatureGroup} from 'leaflet';
import {useContext, useLayoutEffect, useRef} from 'react';
import {FeatureGroup, MapContainer, TileLayer, useMap} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import useAsync from 'react-use/esm/useAsync';

import Loader from '@/components/builder/loader';
import {Component, Description} from '@/components/formio';
import {BuilderContext} from '@/context';
import {ComponentPreviewProps} from '@/registry/types';

import './previews.scss';

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
  } = component;
  const {getMapTileLayers} = useContext(BuilderContext);
  const featureGroupRef = useRef<LeafletFeatureGroup>(null);
  const {value: tileLayers, loading, error} = useAsync(async () => await getMapTileLayers(), []);
  if (error) {
    throw error;
  }
  if (loading) {
    return <Loader />;
  }

  const {required = false} = validate;
  const {lat = 52.1326332, lng = 5.291266} = initialCenter;
  const zoom = defaultZoom ?? 8;

  const tileLayerUrl = (): string => {
    // Try to find the url of the chosen tile layer. If it is found, return the url,
    // else return the default tile layer url.
    return (
      tileLayers?.find(tileLayer => tileLayer.identifier === tileLayerIdentifier)?.url ??
      TILE_LAYER_RD.url
    );
  };

  const onFeatureCreate = (event: any) => {
    featureGroupRef.current?.clearLayers();
    featureGroupRef.current?.addLayer(event.layer);
  };

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
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onFeatureCreate}
            edit={{
              edit: false,
              remove: false,
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
        </FeatureGroup>
        <MapView lat={lat} lng={lng} zoom={zoom} />
      </MapContainer>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
