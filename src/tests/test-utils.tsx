import {SupportedLocales} from '@open-formulieren/types';
import {render as rtlRender} from '@testing-library/react';
import type {RenderOptions, RenderResult} from '@testing-library/react';
import {Formik} from 'formik';
import type {FormikErrors, FormikTouched, FormikValues} from 'formik';
import React from 'react';
import {IntlProvider} from 'react-intl';

import {BuilderContext} from '@/context';
import type {ComponentTranslationsRef, DocumentTypeOption, SelectOption} from '@/context';
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
import {AnyComponentSchema} from '@/types';

import {PrefillAttributeOption, PrefillPluginOption} from '../components/builder/prefill';
import {RegistrationAttributeOption} from '../components/builder/registration/registration-attribute';
import {ValidatorOption} from '../components/builder/validate/validator-select';

interface BuilderOptions {
  supportedLanguageCodes: SupportedLocales[];
  componentTranslationsRef: ComponentTranslationsRef;
  defaultComponentTree: AnyComponentSchema[];
  defaultValidatorPlugins: ValidatorOption[];
  defaultRegistrationAttributes: RegistrationAttributeOption[];
  defaultPrefillPlugins: PrefillPluginOption[];
  defaultPrefillAttributes: {[key: string]: PrefillAttributeOption[]};
  defaultFileTypes: SelectOption[];
  defaultdocumentTypes: DocumentTypeOption[];
  defaultConfidentialityLevels: SelectOption[];
  registrationAttributesDelay: number;
}

const contextRender = (
  ui: React.ReactElement,
  enableContext: boolean = true,
  locale: string = 'en',
  builderOptions: Partial<BuilderOptions> = {},
  renderOptions: RenderOptions = {}
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
              componentTranslationsRef: builderOptions.componentTranslationsRef || {current: null},
              getFormComponents: () =>
                builderOptions.defaultComponentTree || DEFAULT_COMPONENT_TREE,
              getValidatorPlugins: async () => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                return builderOptions.defaultValidatorPlugins || DEFAULT_VALIDATOR_PLUGINS;
              },
              getRegistrationAttributes: async () => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                return (
                  builderOptions.defaultRegistrationAttributes || DEFAULT_REGISTRATION_ATTRIBUTES
                );
              },
              getPrefillPlugins: async () => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                return builderOptions.defaultPrefillPlugins || DEFAULT_PREFILL_PLUGINS;
              },
              getPrefillAttributes: async plugin => {
                await sleep(builderOptions.registrationAttributesDelay || 0);
                const container =
                  builderOptions.defaultPrefillAttributes || DEFAULT_PREFILL_ATTRIBUTES;
                return container?.[plugin] || [{id: '', label: 'no plugins found'}];
              },
              getFileTypes: async () => builderOptions.defaultFileTypes || DEFAULT_FILE_TYPES,
              serverUploadLimit: '50MB',
              getDocumentTypes: async () =>
                builderOptions.defaultdocumentTypes || DEFAULT_DOCUMENT_TYPES,
              getConfidentialityLevels: async () =>
                builderOptions.defaultConfidentialityLevels || CONFIDENTIALITY_LEVELS,
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

const formikRender = (
  ui: React.ReactElement,
  disable: boolean = false,
  locale: string = 'en',
  formikOptions: Partial<FormikOptions> = {},
  renderOptions: RenderOptions = {}
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

// re-export everything (see https://testing-library.com/docs/react-testing-library/setup/#custom-render)
export * from '@testing-library/react';

// Add extra exports
export {contextRender, formikRender};
