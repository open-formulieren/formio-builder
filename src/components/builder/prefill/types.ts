import {ComponentSchema} from 'formiojs';
import {PrefillConfig} from 'types/schemas';

export interface PrefillComponentSchema extends ComponentSchema {
  prefill: PrefillConfig;
}

export interface PrefillPluginOption {
  id: string;
  label: string;
}

export interface PrefillAttributeOption {
  id: string;
  label: string;
}
