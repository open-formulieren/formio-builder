import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

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
  getFormComponents: () => ExtendedComponentSchema[];
  componentTranslationsRef: ComponentTranslationsRef;
}

const BuilderContext = React.createContext<BuilderContextType>({
  uniquifyKey: (key: string) => key,
  getFormComponents: () => [],
  componentTranslationsRef: {current: null},
});

BuilderContext.displayName = 'BuilderContext';

export {BuilderContext};
