import {SupportedLocales} from '@open-formulieren/types';
import {render as rtlRender} from '@testing-library/react';
import type {RenderOptions, RenderResult} from '@testing-library/react';
import {Formik} from 'formik';
import type {FormikErrors, FormikTouched, FormikValues} from 'formik';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {createIntl, createIntlCache} from 'react-intl';

import {PrefillAttributeOption, PrefillPluginOption} from '@/components/builder/prefill';
import {RegistrationAttributeOption} from '@/components/builder/registration/registration-attribute';
import {ValidatorOption} from '@/components/builder/validate/validator-select';
import {
  ReferenceListsServiceOption,
  ReferenceListsTable,
  ReferenceListsTableItem,
} from '@/components/builder/values/reference-lists/types';
import {BuilderContext, BuilderContextType} from '@/context';
import type {DocumentTypeOption, SelectOption} from '@/context';
import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_COMPONENT_TREE,
  DEFAULT_DOCUMENT_TYPES,
  DEFAULT_FILE_TYPES,
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
import {AnyComponentSchema} from '@/types';

interface BuilderOptions {
  supportedLanguageCodes: SupportedLocales[];
  componentTree: AnyComponentSchema[];
  validatorPlugins: ValidatorOption[];
  registrationAttributes: RegistrationAttributeOption[];
  registrationAttributesDelay: number;
  prefillPlugins: PrefillPluginOption[];
  prefillAttributes: {[key: string]: PrefillAttributeOption[]};
  prefillAttributesDelay: number;
  fileTypes: SelectOption[];
  documentTypes: DocumentTypeOption[];
  confidentialityLevels: SelectOption[];
  referenceListsServices: ReferenceListsServiceOption[];
  referenceListsTables: ReferenceListsTable[];
  referenceListsTableItems: Record<string, ReferenceListsTableItem[]>;
  referenceListsDelay: number;
}

interface contextRenderOptions {
  enableContext?: boolean;
  locale?: string;
  builderOptions?: Partial<BuilderOptions>;
  renderOptions?: RenderOptions;
}

const contextRender = (
  ui: React.ReactElement,
  {
    enableContext = true,
    locale = 'en',
    builderOptions = {},
    renderOptions = {},
  }: contextRenderOptions = {}
): RenderResult => {
  function Wrapper({children}: {children: React.ReactNode}) {
    return (
      <IntlProvider locale={locale}>
        {!enableContext ? (
          <>{children}</>
        ) : (
          <BuilderContext.Provider
            value={{
              uniquifyKey: key => key,
              supportedLanguageCodes: builderOptions.supportedLanguageCodes || ['nl', 'en'],
              richTextColors: DEFAULT_COLORS,
              theme: 'light',
              getMapTileLayers: async () => DEFAULT_MAP_TILE_LAYERS,
              getMapOverlayTileLayers: async () => DEFAULT_MAP_OVERLAY_TILE_LAYERS,
              getFormComponents: () => builderOptions.componentTree || DEFAULT_COMPONENT_TREE,
              getValidatorPlugins: async () => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                return builderOptions.validatorPlugins || DEFAULT_VALIDATOR_PLUGINS;
              },
              getRegistrationAttributes: async () => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                return builderOptions.registrationAttributes || DEFAULT_REGISTRATION_ATTRIBUTES;
              },
              getPrefillPlugins: async () => {
                await sleep(builderOptions.prefillAttributesDelay || 0);
                return builderOptions.prefillPlugins || DEFAULT_PREFILL_PLUGINS;
              },
              getPrefillAttributes: async plugin => {
                await sleep(builderOptions.prefillAttributesDelay || 0);
                const container = builderOptions.prefillAttributes || DEFAULT_PREFILL_ATTRIBUTES;
                return container?.[plugin] || [{id: '', label: 'no plugins found'}];
              },
              getServices: async () => {
                await sleep(builderOptions.referenceListsDelay || 0);
                return builderOptions.referenceListsServices || DEFAULT_SERVICES;
              },
              getReferenceListsTables: async () => {
                await sleep(builderOptions.referenceListsDelay || 0);
                return builderOptions.referenceListsTables || DEFAULT_REFERENCE_LISTS_TABLES;
              },
              getReferenceListsTableItems: async (_, tableCode) => {
                await sleep(builderOptions.referenceListsDelay || 0);
                const tableItems =
                  builderOptions.referenceListsTableItems || DEFAULT_REFERENCE_LISTS_TABLE_ITEMS;
                return tableItems[tableCode] ?? [];
              },
              getFileTypes: async () => builderOptions.fileTypes || DEFAULT_FILE_TYPES,
              serverUploadLimit: '50MB',
              getDocumentTypes: async () => builderOptions.documentTypes || DEFAULT_DOCUMENT_TYPES,
              getConfidentialityLevels: async () =>
                builderOptions.confidentialityLevels || CONFIDENTIALITY_LEVELS,
              getAuthPlugins: async () => DEFAULT_AUTH_PLUGINS,
            }}
          >
            {children}
          </BuilderContext.Provider>
        )}
      </IntlProvider>
    );
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
};

interface FormikOptions {
  initialValues: FormikValues;
  initialErrors: FormikErrors<unknown>;
  initialTouched: FormikTouched<unknown>;
  wrapForm: boolean;
}

interface formikRenderOptions {
  disable: boolean;
  locale: string;
  formikOptions: Partial<FormikOptions>;
  renderOptions: RenderOptions;
}

const formikRender = (
  ui: React.ReactElement,
  {disable, locale, formikOptions, renderOptions}: formikRenderOptions = {
    disable: false,
    locale: 'en',
    formikOptions: {},
    renderOptions: {},
  }
): RenderResult => {
  function Wrapper({children}: {children: React.ReactElement}) {
    return (
      <IntlProvider locale={locale}>
        {disable ? (
          <>{children}</>
        ) : (
          <Formik
            initialValues={formikOptions.initialValues || {}}
            initialErrors={formikOptions.initialErrors || {}}
            initialTouched={formikOptions.initialTouched || {}}
            enableReinitialize
            onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
          >
            {formikOptions.wrapForm ? (
              <form id="formik-render-form">{children}</form>
            ) : (
              <>{children}</>
            )}
          </Formik>
        )}
      </IntlProvider>
    );
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
};

// whenever you need an IntlShape, use dummyIntl
const cache = createIntlCache();
const dummyIntl = createIntl({locale: 'en', messages: {}}, cache);

const dummyBuilderContext: BuilderContextType = {
  uniquifyKey: (key: string) => key,
  supportedLanguageCodes: ['nl', 'en'],
  richTextColors: [],
  theme: 'light',
  getMapTileLayers: async () => [],
  getMapOverlayTileLayers: async () => [],
  getFormComponents: () => [],
  getValidatorPlugins: async () => [],
  getRegistrationAttributes: async () => [],
  getPrefillPlugins: async () => [],
  getPrefillAttributes: async () => [],
  getServices: async () => [],
  getReferenceListsTables: async () => [],
  getReferenceListsTableItems: async () => [],
  getFileTypes: async () => [],
  serverUploadLimit: '(unknown)',
  getDocumentTypes: async () => [],
  getConfidentialityLevels: async () => [],
  getAuthPlugins: async () => [],
};

// re-export everything (see https://testing-library.com/docs/react-testing-library/setup/#custom-render)
export * from '@testing-library/react';

// Add extra exports
export {contextRender, formikRender, dummyIntl, dummyBuilderContext};
