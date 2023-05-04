import React from 'react';

import {BuilderContext, BuilderContextType} from '@/context';

import ComponentEditForm, {ComponentEditFormProps} from './ComponentEditForm';

export interface ComponentConfigurationProps extends BuilderContextType, ComponentEditFormProps {}

/**
 * The main entrypoint to edit a component in the builder modal.
 *
 * This component wraps around the context provider to expose Formio builder helper
 * functions and utilities down to the low-level components used to render the
 * configuration form.
 *
 * @param options.uniquifyKey              Function to make component key unique in the context of all existing components.
 * @param options.getFormComponents        Function returning all other Formio components in the builder context.
 * @param options.componentTranslationsRef Object containing the existing translations from other components, keyed by language code. Each entry is a map of literal => translation.
 * @param options.isNew                    Whether the Formio component is a new component being added or an existing being edited.
 * @param options.component                The (starter) schema of the Formio component being edited.
 * @param options.builderInfo              Meta information from the builder configuration for the Formio component.
 * @param options.onCancel                 Callback to invoke when the 'cancel' button is clicked.
 * @param options.onRemove                 Callback to invoke when the 'remove' button is clicked.
 */
const ComponentConfiguration: React.FC<ComponentConfigurationProps> = ({
  uniquifyKey,
  supportedLanguageCodes = ['nl', 'en'],
  componentTranslationsRef,
  getFormComponents,
  getValidatorPlugins,
  getRegistrationAttributes,
  getPrefillPlugins,
  getPrefillAttributes,
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
}) => (
  <BuilderContext.Provider
    value={{
      uniquifyKey,
      supportedLanguageCodes,
      componentTranslationsRef,
      getFormComponents,
      getValidatorPlugins,
      getRegistrationAttributes,
      getPrefillPlugins,
      getPrefillAttributes,
    }}
  >
    <ComponentEditForm
      isNew={isNew}
      component={component}
      builderInfo={builderInfo}
      onCancel={onCancel}
      onRemove={onRemove}
    />
  </BuilderContext.Provider>
);

export default ComponentConfiguration;
