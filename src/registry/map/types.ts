import type {MapComponentSchema} from '@open-formulieren/types';

// The type definition of a singular overlay, without the url
export type OverlayWithoutUrl = Omit<NonNullable<MapComponentSchema['overlays']>[number], 'url'>;
