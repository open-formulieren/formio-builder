import {SupportedLocales} from '@open-formulieren/types';
import React from 'react';

import {PrefillAttributeOption, PrefillPluginOption} from '@/components/builder/prefill/types';
import {RegistrationAttributeOption} from '@/components/builder/registration/registration-attribute';
import type {ColorOption} from '@/components/builder/rich-text';
import {ValidatorOption} from '@/components/builder/validate/validator-select';
import {
  ReferenceListsServiceOption,
  ReferenceListsTable,
  ReferenceListsTableItem,
} from '@/components/builder/values/reference-lists/types';
import {AuthPluginOption} from '@/registry/cosignV1/edit';
import {AnyComponentSchema} from '@/types';

/*
  Generic select options
 */
export interface SelectOption {
  value: string;
  label: string;
}

/*
  ZGW Document types integration

  This datastructure is created by the Open Forms backend which takes the registration
  backends on the form into account.
 */
export interface DocumentTypeOption {
  backendLabel: string;
  catalogueLabel: string;
  url: string;
  description: string;
}

/*
  Map tile layers

  This datastructure is created by the Open Forms backend.
 */
export interface MapTileLayer {
  identifier: string;
  url: string;
  label: string;
}

/*
  Builder
 */

export interface BuilderContextType {
  uniquifyKey: (key: string) => string;
  supportedLanguageCodes: SupportedLocales[];
  richTextColors: ColorOption[];
  theme: 'light' | 'dark';
  getFormComponents: () => AnyComponentSchema[];
  getValidatorPlugins: (componentType: string) => Promise<ValidatorOption[]>;
  getRegistrationAttributes: (componentType: string) => Promise<RegistrationAttributeOption[]>;
  getServices: (type: string) => Promise<ReferenceListsServiceOption[]>;
  getReferenceListsTables: (service: string) => Promise<ReferenceListsTable[]>;
  getReferenceListsTableItems: (
    service: string,
    tableCode: string
  ) => Promise<ReferenceListsTableItem[]>;
  getPrefillPlugins: (componentType: string) => Promise<PrefillPluginOption[]>;
  getPrefillAttributes: (plugin: string) => Promise<PrefillAttributeOption[]>;
  getFileTypes: () => Promise<SelectOption[]>;
  serverUploadLimit: string;
  getDocumentTypes: () => Promise<Array<DocumentTypeOption>>;
  getConfidentialityLevels: () => Promise<SelectOption[]>;
  getAuthPlugins: () => Promise<AuthPluginOption[]>;
  getMapTileLayers: () => Promise<MapTileLayer[]>;
}

const BuilderContext = React.createContext<BuilderContextType>({
  uniquifyKey: (key: string) => key,
  supportedLanguageCodes: ['nl', 'en'],
  richTextColors: [],
  theme: 'light',
  getFormComponents: () => [],
  getValidatorPlugins: async () => [],
  getRegistrationAttributes: async () => [],
  getServices: async () => [],
  getReferenceListsTables: async () => [],
  getReferenceListsTableItems: async () => [],
  getPrefillPlugins: async () => [],
  getPrefillAttributes: async () => [],
  getFileTypes: async () => [],
  serverUploadLimit: '(unknown)',
  getDocumentTypes: async () => [],
  getConfidentialityLevels: async () => [],
  getAuthPlugins: async () => [],
  getMapTileLayers: async () => [],
});

BuilderContext.displayName = 'BuilderContext';

/*
  Rendering
 */
export interface RenderContextType {
  // whether the component should be rendered 'bare' or wrapped in the container divs with label, tooltip... etc.
  bareInput: boolean;
}

const RenderContext = React.createContext<RenderContextType>({
  bareInput: false,
});

export {BuilderContext, RenderContext};
