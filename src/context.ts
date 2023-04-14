import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

import {ValidatorOption} from '@components/builder/validate/validator-select';

interface TranslationsMap {
  [key: string]: string;
}

interface TranslationsStore {
  [key: string]: TranslationsMap;
}

interface ComponentTranslationsRef {
  current: null | TranslationsStore;
}

export interface BuilderContextType {
  uniquifyKey: (key: string) => string;
  supportedLanguageCodes: string[];
  componentTranslationsRef: ComponentTranslationsRef;
  getFormComponents: () => ExtendedComponentSchema[];
  getValidatorPlugins: (componentType: string) => Promise<ValidatorOption[]>;
}

const BuilderContext = React.createContext<BuilderContextType>({
  uniquifyKey: (key: string) => key,
  supportedLanguageCodes: ['nl', 'en'],
  componentTranslationsRef: {current: null},
  getFormComponents: () => [],
  getValidatorPlugins: async () => [],
});

BuilderContext.displayName = 'BuilderContext';

export {BuilderContext};
