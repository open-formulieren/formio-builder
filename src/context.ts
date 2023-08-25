import {SupportedLocales} from '@open-formulieren/types';
import React from 'react';

import {PrefillAttributeOption, PrefillPluginOption} from '@/components/builder/prefill/types';
import {RegistrationAttributeOption} from '@/components/builder/registration/registration-attribute';
import {ValidatorOption} from '@/components/builder/validate/validator-select';
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

interface ComponentTranslationsRef {
  current: null | TranslationsStore;
}

/*
  Builder
 */

export interface BuilderContextType {
  uniquifyKey: (key: string) => string;
  supportedLanguageCodes: SupportedLocales[];
  componentTranslationsRef: ComponentTranslationsRef;
  getFormComponents: () => AnyComponentSchema[];
  getValidatorPlugins: (componentType: string) => Promise<ValidatorOption[]>;
  getRegistrationAttributes: (componentType: string) => Promise<RegistrationAttributeOption[]>;
  getPrefillPlugins: (componentType: string) => Promise<PrefillPluginOption[]>;
  getPrefillAttributes: (plugin: string) => Promise<PrefillAttributeOption[]>;
}

const BuilderContext = React.createContext<BuilderContextType>({
  uniquifyKey: (key: string) => key,
  supportedLanguageCodes: ['nl', 'en'],
  componentTranslationsRef: {current: null},
  getFormComponents: () => [],
  getValidatorPlugins: async () => [],
  getRegistrationAttributes: async () => [],
  getPrefillPlugins: async () => [],
  getPrefillAttributes: async () => [],
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
