// This module contains shared utilities and constants between Jest and Storybook.
import type {DocumentTypeOption, SelectOption} from '@/context';
import {AnyComponentSchema} from '@/types';

import {PrefillAttributeOption, PrefillPluginOption} from '../components/builder/prefill';
import {RegistrationAttributeOption} from '../components/builder/registration/registration-attribute';
import {ValidatorOption} from '../components/builder/validate/validator-select';
import {AuthPluginOption} from '../registry/cosignV1/edit';


export const DEFAULT_COMPONENT_TREE: AnyComponentSchema[] = [
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

export const DEFAULT_VALIDATOR_PLUGINS: ValidatorOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

export const DEFAULT_REGISTRATION_ATTRIBUTES: RegistrationAttributeOption[] = [
  {id: 'attribute-1', label: 'Attribute 1'},
  {id: 'attribute-2', label: 'Attribute 2'},
];

export const DEFAULT_PREFILL_PLUGINS: PrefillPluginOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

export const DEFAULT_PREFILL_ATTRIBUTES: {[key: string]: PrefillAttributeOption[]} = {
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

export const CONFIDENTIALITY_LEVELS: SelectOption[] = [
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

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
