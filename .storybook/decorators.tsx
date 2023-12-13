import type {Decorator} from '@storybook/react';
import {Formik} from 'formik';

import {BuilderContext, DocumentTypeOption} from '@/context';

import {PrefillAttributeOption, PrefillPluginOption} from '../src/components/builder/prefill';
import {RegistrationAttributeOption} from '../src/components/builder/registration/registration-attribute';
import {ValidatorOption} from '../src/components/builder/validate/validator-select';
import {AuthPluginOption} from '../src/registry/cosignV1/edit';

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

export const DEFAULT_FILE_TYPES = [
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

export const DEFAULT_AUTH_PLUGINS: AuthPluginOption[] = [
  {
    id: 'digid',
    label: 'DigiD, provides: bsn',
  },
  {
    id: 'eherkenning',
    label: 'eHerkenning, provides: kvk',
  },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
