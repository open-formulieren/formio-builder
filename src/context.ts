import {SupportedLocales} from '@open-formulieren/types';
import React from 'react';

import {PrefillAttributeOption, PrefillPluginOption} from '@/components/builder/prefill/types';
import {RegistrationAttributeOption} from '@/components/builder/registration/registration-attribute';
import {ValidatorOption} from '@/components/builder/validate/validator-select';
import type {ColorOption} from '@/registry/content/rich-text';
import {AuthPluginOption} from '@/registry/cosignV1/edit';
import {AnyComponentSchema} from '@/types';

/*
  Translations
 */

interface TranslationsMap {
  [key: string]: string;
}

interface TranslationsStore {
  [key: string]: TranslationsMap;
}

export interface ComponentTranslationsRef {
  current: null | TranslationsStore;
}

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
  catalogus: {
    domein: string;
  };
  informatieobjecttype: {
    url: string;
    omschrijving: string;
  };
}

/*
  Builder
 */

export interface BuilderContextType {
  uniquifyKey: (key: string) => string;
  supportedLanguageCodes: SupportedLocales[];
  richTextColors: ColorOption[];
  componentTranslationsRef: ComponentTranslationsRef;
  getFormComponents: () => AnyComponentSchema[];
  getValidatorPlugins: (componentType: string) => Promise<ValidatorOption[]>;
  getRegistrationAttributes: (componentType: string) => Promise<RegistrationAttributeOption[]>;
  getPrefillPlugins: (componentType: string) => Promise<PrefillPluginOption[]>;
  getPrefillAttributes: (plugin: string) => Promise<PrefillAttributeOption[]>;
  getFileTypes: () => Promise<SelectOption[]>;
  serverUploadLimit: string;
  getDocumentTypes: () => Promise<Array<DocumentTypeOption>>;
  getConfidentialityLevels: () => Promise<SelectOption[]>;
  getAuthPlugins: () => Promise<AuthPluginOption[]>;
}

const BuilderContext = React.createContext<BuilderContextType>({
  uniquifyKey: (key: string) => key,
  supportedLanguageCodes: ['nl', 'en'],
  richTextColors: [],
  componentTranslationsRef: {current: null},
  getFormComponents: () => [],
  getValidatorPlugins: async () => [],
  getRegistrationAttributes: async () => [],
  getPrefillPlugins: async () => [],
  getPrefillAttributes: async () => [],
  getFileTypes: async () => [],
  serverUploadLimit: '(unknown)',
  getDocumentTypes: async () => [],
  getConfidentialityLevels: async () => [],
  getAuthPlugins: async () => [],
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
