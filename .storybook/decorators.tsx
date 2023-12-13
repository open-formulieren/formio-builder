import type {Decorator} from '@storybook/react';
import {Formik} from 'formik';

import {BuilderContext} from '@/context';
import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COMPONENT_TREE,
  DEFAULT_DOCUMENT_TYPES,
  DEFAULT_FILE_TYPES,
  DEFAULT_PREFILL_ATTRIBUTES,
  DEFAULT_PREFILL_PLUGINS,
  DEFAULT_REGISTRATION_ATTRIBUTES,
  DEFAULT_VALIDATOR_PLUGINS,
  sleep,
} from '@/tests/sharedUtils';

export const ModalDecorator: Decorator = (Story, {parameters}) => {
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

export const BuilderContextDecorator: Decorator = (Story, context) => {
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
  const defaultFileTypes = context.parameters.builder?.defaultFileTypes || DEFAULT_FILE_TYPES;
  const defaultdocumentTypes =
    context.parameters.builder?.defaultdocumentTypes || DEFAULT_DOCUMENT_TYPES;

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
        getFileTypes: async () => {
          return context?.args?.fileTypes || defaultFileTypes;
        },
        serverUploadLimit: '50MB',
        getDocumentTypes: async () => context?.args?.documentTypes || defaultdocumentTypes,
        getConfidentialityLevels: async () => CONFIDENTIALITY_LEVELS,
        getAuthPlugins: async () => DEFAULT_AUTH_PLUGINS,
      }}
    >
      <Story />
    </BuilderContext.Provider>
  );
};

export const withFormik: Decorator = (Story, context) => {
  const isDisabled = context.parameters?.formik?.disable ?? false;
  if (isDisabled) {
    return <Story />;
  }
  const initialValues = context.parameters?.formik?.initialValues || {};
  const initialErrors = context.parameters?.formik?.initialErrors || {};
  const initialTouched = context.parameters?.formik?.initialTouched || {};
  const wrapForm = context.parameters?.formik?.wrapForm ?? true;
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      initialTouched={initialTouched}
      enableReinitialize
      onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
    >
      {wrapForm ? (
        <form id="storybook-withFormik-decorator-form">
          <Story />
        </form>
      ) : (
        <Story />
      )}
    </Formik>
  );
};
