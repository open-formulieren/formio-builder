import {AnyComponentSchema} from '@open-formulieren/types';
import {Prefill} from '@open-formulieren/types/dist/extensions';

export type ComponentWithPrefill = Extract<Required<AnyComponentSchema>, Prefill>;

export interface PrefillPluginOption {
  id: string;
  label: string;
}

export interface PrefillAttributeOption {
  id: string;
  label: string;
}
