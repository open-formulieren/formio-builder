import type {StoryContext, StoryFn} from '@storybook/react';
import React from 'react';

import {PrefillAttributeOption, PrefillPluginOption} from '../src/components/builder/prefill';
import {RegistrationAttributeOption} from '../src/components/builder/registration/registration-attribute';
import {ValidatorOption} from '../src/components/builder/validate/validator-select';
import {BuilderContext} from '../src/context';

export const ModalDecorator = (Story, {parameters}) => {
  if (parameters?.modal?.noModal) return <Story />;
  return (
    <div
      className="formio-dialog formio-dialog-theme-default component-settings"
      style={{position: 'relative'}}
    >
      <div className="formio-dialog-overlay" style={{position: 'relative'}}></div>
      <div className="formio-dialog-content">
        <div></div>
        <button
          aria-label="close"
          className="formio-dialog-close float-right btn btn-secondary btn-sm"
        ></button>
        <div className="component-edit-container">
          <Story />
        </div>
      </div>
    </div>
  );
};

const DEFAULT_COMPONENT_TREE = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2'},
      {type: 'number', key: 'nested.number1', label: 'Nested number'},
    ],
  },
];

const DEFAULT_VALIDATOR_PLUGINS: ValidatorOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

const DEFAULT_REGISTRATION_ATTRIBUTES: RegistrationAttributeOption[] = [
  {id: 'attribute-1', label: 'Attribute 1'},
  {id: 'attribute-2', label: 'Attribute 2'},
];

const DEFAULT_PREFILL_PLUGINS: PrefillPluginOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

const DEFAULT_PREFILL_ATTRIBUTES: {[key: string]: PrefillAttributeOption[]} = {
  'plugin-1': [
    {id: 'plugin-1-attribute-1', label: 'Plugin 1, attribute 1'},
    {id: 'plugin-1-attribute-2', label: 'Plugin 1, attribute 2'},
  ],
  'plugin-2': [
    {id: 'plugin-2-attribute-1', label: 'Plugin 2, attribute 1'},
    {id: 'plugin-2-attribute-2', label: 'Plugin 2, attribute 2'},
  ],
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const BuilderContextDecorator = (Story: StoryFn, context: StoryContext) => {
  if (!context.parameters?.builder?.enableContext) return <Story />;
  const supportedLanguageCodes = context.parameters.builder?.supportedLanguageCodes || ['nl', 'en'];
  const translationsStore = context.parameters.builder?.translationsStore || null;
  const defaultComponentTree =
    context.parameters.builder?.defaultComponentTree || DEFAULT_COMPONENT_TREE;
  const defaultValidatorPlugins =
    context.parameters.builder?.defaultValidatorPlugins || DEFAULT_VALIDATOR_PLUGINS;
  const defaultRegistrationAttributes =
    context.parameters.builder?.defaultRegistrationAttributes || DEFAULT_REGISTRATION_ATTRIBUTES;
  const defaultPrefillPlugins =
    context.parameters.builder?.defaultPrefillPlugins || DEFAULT_PREFILL_PLUGINS;
  const defaultPrefillAttributes =
    context.parameters.builder?.defaultPrefillAttributes || DEFAULT_PREFILL_ATTRIBUTES;
  return (
    <BuilderContext.Provider
      value={{
        uniquifyKey: key => key,
        supportedLanguageCodes: supportedLanguageCodes,
        componentTranslationsRef: {current: translationsStore},
        getFormComponents: () => context?.args?.componentTree || defaultComponentTree,
        getValidatorPlugins: async () => {
          await sleep(context.parameters?.builder?.validatorPluginsDelay || 0);
          return context?.args?.validatorPlugins || defaultValidatorPlugins;
        },
        getRegistrationAttributes: async () => {
          await sleep(context.parameters?.builder?.registrationAttributesDelay || 0);
          return context?.args?.registrationAttributes || defaultRegistrationAttributes;
        },
        getPrefillPlugins: async () => {
          await sleep(context.parameters?.builder?.prefillPluginsDelay || 0);
          return context?.args?.prefillPlugins || defaultPrefillPlugins;
        },
        getPrefillAttributes: async (plugin: string) => {
          await sleep(context.parameters?.builder?.prefillPluginsDelay || 0);
          const container = context?.args?.prefillAttributes || defaultPrefillAttributes;
          return container?.[plugin] || [{id: '', label: 'no plugins found'}];
        },
      }}
    >
      <Story />
    </BuilderContext.Provider>
  );
};
