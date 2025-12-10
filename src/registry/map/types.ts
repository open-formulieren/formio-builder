import type {MapComponentSchema} from '@open-formulieren/types';

// The type definition of a singular overlay with formio-builder specific properties.
export type ExtendedMapOverlay = NonNullable<MapComponentSchema['overlays']>[number] & {
  /**
   * Internal ID of the overlay. This is used to identify the overlay in the configuration form.
   */
  _OF_INTERNAL_id?: string;
};
