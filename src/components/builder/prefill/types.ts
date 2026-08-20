import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Prefill} from '@open-formulieren/types/dist/extensions';

export type ComponentWithPrefill = Extract<Required<AnyComponentSchema>, Prefill>;
export type PrefillAttribute = NonNullable<Prefill['prefill']>['attribute'] | undefined;
export type PrefillPlugin = NonNullable<Prefill['prefill']>['plugin'] | undefined;

export interface PrefillPluginOption {
  id: string;
  label: string;
}

export interface PrefillAttributeOption {
  id: string;
  label: string;
}
