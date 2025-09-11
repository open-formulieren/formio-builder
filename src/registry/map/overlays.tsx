import {FieldArray, type FieldArrayRenderProps, useField, useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Loader from '@/components/builder/loader';
import {Component, Panel, Select, TextField} from '@/components/formio';
import {BuilderContext, type MapOverlayTileLayer} from '@/context';

import {getWMSLayerOptions} from './getTileLayerOptions';
import './overlays.scss';
import type {OverlayWithoutUrl} from './types';

const Overlays: React.FC = () => {
  const intl = useIntl();
  const {getMapOverlayTileLayers} = useContext(BuilderContext);
  const [{value}] = useField<OverlayWithoutUrl[]>('overlays');
  const {
    value: overlayTileLayers,
    loading,
    error,
  } = useAsync(async () => await getMapOverlayTileLayers(), []);
  if (error) {
    throw error;
  }
  if (loading) {
    return <Loader />;
  }

  const tooltip = intl.formatMessage({
    description: "Tooltip for the 'overlays' builder field",
    defaultMessage:
      'The overlay is used to show additional map information on top of the map background. This uses tile layers as information source.',
  });

  return (
    <Component
      type="datagrid"
      label={
        <FormattedMessage
          description="Label for the 'overlays' builder field"
          defaultMessage="Overlays"
        />
      }
      tooltip={tooltip}
    >
      <FieldArray name="overlays">
        {arrayHelpers => (
          <>
            {value?.map(({uuid, label}, index) => (
              <OverlayTileLayer
                // index will always be unique, but gets confused when items are shuffled
                // around. The label and uuid are added for additional 'cache' busting,
                // as those values increase uniqueness.
                key={`${uuid}/${index}/${label}`}
                index={index}
                arrayHelpers={arrayHelpers}
                overlayTileLayers={overlayTileLayers}
              />
            ))}
            <div>
              <button
                type="button"
                className="btn btn-primary formio-button-add-row"
                onClick={() =>
                  arrayHelpers.push({
                    uuid: '',
                    label: '',
                    type: 'wms', // We currently only support WMS tile layers.
                    layers: [],
                  } satisfies OverlayWithoutUrl)
                }
              >
                <i className="fa fa-plus" aria-hidden="true" />{' '}
                <FormattedMessage
                  description="'overlays' builder field 'add another overlay' button label"
                  defaultMessage="Add another overlay"
                />
              </button>
            </div>
          </>
        )}
      </FieldArray>
    </Component>
  );
};

interface OverlayTileLayerProps {
  index: number;
  arrayHelpers: FieldArrayRenderProps;
  overlayTileLayers?: MapOverlayTileLayer[];
}

const OverlayTileLayer: React.FC<OverlayTileLayerProps> = ({
  index,
  arrayHelpers,
  overlayTileLayers,
}) => {
  const intl = useIntl();
  const fieldNamePrefix = `overlays[${index}]`;
  const {getFieldProps, getFieldHelpers} = useFormikContext();

  const numOptions = getFieldProps<OverlayWithoutUrl[]>('overlays').value?.length || 0;
  const {value} = getFieldProps(fieldNamePrefix);
  const {setValue} = getFieldHelpers<OverlayWithoutUrl>(fieldNamePrefix);
  const selectedTileLayerUrl = overlayTileLayers?.find(
    tileLayer => tileLayer.uuid === value.uuid
  )?.url;

  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => {
    return selectedTileLayerUrl ? await getWMSLayerOptions(selectedTileLayerUrl) : [];
  }, [selectedTileLayerUrl]);
  if (error) {
    throw error;
  }

  return (
    <Panel
      title={
        <FormattedMessage
          description="Map 'overlays' configuration panel title"
          defaultMessage="Overlay: {overlayName}"
          values={{
            overlayName: value.label ?? '-',
          }}
        />
      }
      collapsible
      initialCollapsed={!!value.uuid}
      headerEnd={
        <div className="offb-overlay">
          <div className="offb-overlay__sort-icons">
            <button
              type="button"
              aria-label={intl.formatMessage({
                description: "Map 'overlays' configuration panel: move layer up",
                defaultMessage: 'Move up',
              })}
              onClick={() => arrayHelpers.move(index, index - 1)}
              disabled={index === 0}
            >
              <i className="fa fa-chevron-up" />
            </button>
            <button
              type="button"
              aria-label={intl.formatMessage({
                description: "Map 'overlays' configuration panel: move layer down",
                defaultMessage: 'Move down',
              })}
              onClick={() => arrayHelpers.move(index, index + 1)}
              disabled={index === numOptions - 1}
            >
              <i className="fa fa-chevron-down" />
            </button>
          </div>
        </div>
      }
    >
      <Select
        name={`${fieldNamePrefix}.uuid`}
        label={intl.formatMessage({
          description: "Map 'overlays' configuration: label for tile layer",
          defaultMessage: 'Tile layer',
        })}
        required
        options={overlayTileLayers}
        valueProperty="uuid"
        getOptionLabel={option => option.name}
        onChange={event => {
          const layerUuid = event.target.value;
          const newLayer = overlayTileLayers?.find(layer => layer.uuid === layerUuid);
          // When updating the uuid, also update the other fields as everything is
          // related to the uuid.
          setValue({
            ...value,
            uuid: layerUuid,
            label: newLayer?.name ?? '',
            layers: [],
          });
        }}
      />

      <TextField
        name={`${fieldNamePrefix}.label`}
        label={intl.formatMessage({
          description: "Map 'overlays' configuration: label for label",
          defaultMessage: 'Label',
        })}
        required
      />

      <Select
        name={`${fieldNamePrefix}.layers`}
        label={intl.formatMessage({
          description: "Map 'overlays' configuration: label for layers",
          defaultMessage: 'Layers',
        })}
        options={options}
        isLoading={loading}
        isMulti
      />

      <button
        type="button"
        className="btn btn-danger float-right"
        onClick={() => arrayHelpers.remove(index)}
      >
        <i className="fa fa-times-circle-o" />{' '}
        <FormattedMessage
          description="Map 'overlays' configuration: label for delete overlay button"
          defaultMessage="Remove overlay"
        />
      </button>
    </Panel>
  );
};

export default Overlays;
