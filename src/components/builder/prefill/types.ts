import {ComponentSchema} from 'formiojs';

export interface PrefillConfig {
  plugin: string | null;
  attribute: string | null;
}

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
