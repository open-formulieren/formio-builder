import type {Decorator} from '@storybook/react';
import {Formik} from 'formik';

import {ModalContext} from '@/components/Modal';
import {ReferenceListsTableItem} from '@/components/builder/values/reference-lists/types';
import {BuilderContext, MapOverlayTileLayer, MapTileLayer} from '@/context';
import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_COMPONENT_TREE,
  DEFAULT_DOCUMENT_TYPES,
  DEFAULT_FILE_TYPES,
  DEFAULT_FORM_MODE,
  DEFAULT_MAP_OVERLAY_TILE_LAYERS,
  DEFAULT_MAP_TILE_LAYERS,
  DEFAULT_PREFILL_ATTRIBUTES,
  DEFAULT_PREFILL_PLUGINS,
  DEFAULT_REFERENCE_LISTS_TABLES,
  DEFAULT_REFERENCE_LISTS_TABLE_ITEMS,
  DEFAULT_REGISTRATION_ATTRIBUTES,
  DEFAULT_SERVICES,
  DEFAULT_VALIDATOR_PLUGINS,
  sleep,
} from '@/tests/sharedUtils';

export const ModalDecorator: Decorator = (Story, {parameters}) => {
  if (parameters?.modal?.noModal)
    return (
      <ModalContext.Provider
        value={{
          // only for storybook integration, do not use this in real apps!
          parentSelector: () => document.getElementById('storybook-root')!,
          ariaHideApp: false,
        }}
      >
        <Story />
      </ModalContext.Provider>
    );
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
  const theme = context.parameters.builder?.theme || 'light';
  const defaultComponentTree =
    context.parameters.builder?.defaultComponentTree || DEFAULT_COMPONENT_TREE;
  const defaultValidatorPlugins =
    context.parameters.builder?.defaultValidatorPlugins || DEFAULT_VALIDATOR_PLUGINS;
  const defaultRegistrationAttributes =
    context.parameters.builder?.defaultRegistrationAttributes || DEFAULT_REGISTRATION_ATTRIBUTES;
  const defaultServices = context.parameters.builder?.defaultServices || DEFAULT_SERVICES;
  const defaultReferenceListsTables =
    context.parameters.builder?.defaultReferenceListsTables || DEFAULT_REFERENCE_LISTS_TABLES;
  const defaultReferenceListsTableItems: Record<string, ReferenceListsTableItem[]> =
    context.parameters.builder?.defaultReferenceListsTableItems ||
    DEFAULT_REFERENCE_LISTS_TABLE_ITEMS;
  const defaultPrefillPlugins =
    context.parameters.builder?.defaultPrefillPlugins || DEFAULT_PREFILL_PLUGINS;
  const defaultPrefillAttributes =
    context.parameters.builder?.defaultPrefillAttributes || DEFAULT_PREFILL_ATTRIBUTES;
  const defaultFileTypes = context.parameters.builder?.defaultFileTypes || DEFAULT_FILE_TYPES;
  const defaultdocumentTypes =
    context.parameters.builder?.defaultdocumentTypes || DEFAULT_DOCUMENT_TYPES;
  const defaultFormMode = context.parameters.builder?.formMode || DEFAULT_FORM_MODE;

  return (
    <BuilderContext.Provider
      value={{
        uniquifyKey: key => key,
        supportedLanguageCodes: supportedLanguageCodes,
        richTextColors: DEFAULT_COLORS,
        formMode: defaultFormMode,
        getMapTileLayers: async () => {
          const itemsFromArgs = context?.args?.mapTileLayers as MapTileLayer[] | undefined;
          return itemsFromArgs || DEFAULT_MAP_TILE_LAYERS;
        },
        getMapOverlayTileLayers: async () => {
          const itemsFromArgs = context?.args?.mapOverlayTileLayers as
            | MapOverlayTileLayer[]
            | undefined;
          return itemsFromArgs || DEFAULT_MAP_OVERLAY_TILE_LAYERS;
        },
        theme,
        getFormComponents: () => context?.args?.componentTree || defaultComponentTree,
        getValidatorPlugins: async () => {
          await sleep(context.parameters?.builder?.validatorPluginsDelay || 0);
          return context?.args?.validatorPlugins || defaultValidatorPlugins;
        },
        getRegistrationAttributes: async () => {
          await sleep(context.parameters?.builder?.registrationAttributesDelay || 0);
          return context?.args?.registrationAttributes || defaultRegistrationAttributes;
        },
        getServices: async () => {
          await sleep(context.parameters?.builder?.servicesDelay || 0);
          return context?.args?.services || defaultServices;
        },
        getReferenceListsTables: async () => {
          await sleep(context.parameters?.builder?.referenceListsTablesDelay || 0);
          return context?.args?.referenceListsTables || defaultReferenceListsTables;
        },
        getReferenceListsTableItems: async (_, tableCode) => {
          await sleep(context.parameters?.builder?.referenceListsTableItemDelay || 0);
          const itemsFromArgs = context?.args?.referenceListsTableItems as
            | Record<string, ReferenceListsTableItem[]>
            | undefined;
          const referenceListsTableItems = itemsFromArgs || defaultReferenceListsTableItems;
          const items = referenceListsTableItems[tableCode];
          return items;
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
