import {SupportedLocales} from '@open-formulieren/types';
import {render as rtlRender} from '@testing-library/react';
import type {RenderOptions, RenderResult} from '@testing-library/react';
import {Formik} from 'formik';
import type {FormikErrors, FormikTouched, FormikValues} from 'formik';
import React from 'react';
import {IntlProvider} from 'react-intl';

import {BuilderContext} from '@/context';
import type {ComponentTranslationsRef, DocumentTypeOption, SelectOption} from '@/context';
import {AnyComponentSchema} from '@/types';

import {PrefillAttributeOption, PrefillPluginOption} from '../src/components/builder/prefill';
import {RegistrationAttributeOption} from '../src/components/builder/registration/registration-attribute';
import {ValidatorOption} from '../src/components/builder/validate/validator-select';

const DEFAULT_COMPONENT_TREE: AnyComponentSchema[] = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1', id: 'id1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    id: 'id2',
    hideHeader: false,
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2', id: 'id3'},
      {type: 'number', key: 'nested.number1', label: 'Nested number', id: 'id4'},
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

export const DEFAULT_FILE_TYPES: SelectOption[] = [
  {
    label: 'any filetype',
    value: '*',
  },
  {
    label: '.heic',
    value: 'image/heic',
  },
  {
    label: '.png',
    value: 'image/png',
  },
  {
    label: '.jpg',
    value: 'image/jpeg',
  },
  {
    label: '.pdf',
    value: 'application/pdf',
  },
  {
    label: '.xls',
    value: 'application/vnd.ms-excel',
  },
  {
    label: '.xlsx',
    value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    label: '.csv',
    value: 'text/csv',
  },
  {
    label: '.txt',
    value: 'text/plain',
  },
  {
    label: '.doc',
    value: 'application/msword',
  },
  {
    label: '.docx',
    value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    label: 'Open Office',
    value:
      'application/vnd.oasis.opendocument.*,application/vnd.stardivision.*,application/vnd.sun.xml.*',
  },
  {
    label: '.zip',
    value: 'application/zip',
  },
  {
    label: '.rar',
    value: 'application/vnd.rar',
  },
  {
    label: '.tar',
    value: 'application/x-tar',
  },
  {
    label: '.msg',
    value: 'application/vnd.ms-outlook',
  },
  {
    label: '.dwg',
    value:
      'application/acad.dwg,application/autocad_dwg.dwg,application/dwg.dwg,application/x-acad.dwg,application/x-autocad.dwg,application/x-dwg.dwg,drawing/dwg.dwg,image/vnd.dwg,image/x-dwg.dwg',
  },
];

export const DEFAULT_DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    backendLabel: '',
    catalogus: {
      domein: 'VTH',
    },
    informatieobjecttype: {
      url: 'https://example.com/iotype/123',
      omschrijving: 'Vergunning',
    },
  },
  {
    backendLabel: 'Open Zaak',
    catalogus: {
      domein: 'VTH',
    },
    informatieobjecttype: {
      url: 'https://example.com/iotype/456',
      omschrijving: 'Vergunning',
    },
  },
  {
    backendLabel: 'Open Zaak',
    catalogus: {
      domein: 'VTH',
    },
    informatieobjecttype: {
      url: 'https://example.com/iotype/789',
      omschrijving: 'Ontheffing',
    },
  },
  {
    backendLabel: 'Open Zaak',
    catalogus: {
      domein: 'SOC',
    },
    informatieobjecttype: {
      url: 'https://example.com/iotype/abc',
      omschrijving: 'Aanvraag',
    },
  },
];

export const CONFIDENTIALITY_LEVELS = [
  {label: 'Openbaar', value: 'openbaar'},
  {label: 'Beperkt openbaar', value: 'beperkt_openbaar'},
  {label: 'Intern', value: 'intern'},
  {label: 'Zaakvertrouwelijk', value: 'zaakvertrouwelijk'},
  {label: 'Vertrouwelijk', value: 'vertrouwelijk'},
  {label: 'Confidentieel', value: 'confidentieel'},
  {label: 'Geheim', value: 'geheim'},
  {label: 'Zeer geheim', value: 'zeer_geheim'},
];

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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
