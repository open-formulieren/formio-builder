import {PrefillConfig, StrictComponentSchema} from '@open-formulieren/types';

export type ComponentWithPrefill = StrictComponentSchema<any> & Required<PrefillConfig>;

export interface PrefillPluginOption {
  id: string;
  label: string;
}

export interface PrefillAttributeOption {
  id: string;
  label: string;
}
