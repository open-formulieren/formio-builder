// This module contains shared utilities and constants between Jest and Storybook.
import type {ColorOption} from '@/components/builder/rich-text';
import {
  ReferenceListsServiceOption,
  ReferenceListsTable,
  ReferenceListsTableItem,
} from '@/components/builder/values/reference-lists/types';
import type {DocumentTypeOption, MapOverlayTileLayer, MapTileLayer, SelectOption} from '@/context';
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

export const DEFAULT_SERVICES: ReferenceListsServiceOption[] = [
  {
    url: 'http://localhost:8000/api/v2/services/70',
    slug: 'reference-lists',
    label: 'Reference lists 1',
    apiRoot: 'http://localhost:8004/api/v1/',
    apiType: 'orc',
  },
  {
    url: 'http://localhost:8000/api/v2/services/6',
    slug: 'reference-lists2',
    label: 'Reference lists 2',
    apiRoot: 'http://localhost:8003/documenten/api/v1/',
    apiType: 'drc',
  },
];

export const DEFAULT_REFERENCE_LISTS_TABLES: ReferenceListsTable[] = [
  {
    code: 'table1',
    name: 'Table 1',
    isValid: true,
  },
  {
    code: 'table2',
    name: 'Table 2',
    isValid: false,
  },
];

export const DEFAULT_REFERENCE_LISTS_TABLE_ITEMS: Record<string, ReferenceListsTableItem[]> = {
  table1: [
    {
      code: 'option1',
      name: 'Table 1, option 1',
      isValid: true,
    },
    {
      code: 'option2',
      name: 'Table 1, option 2',
      isValid: false,
    },
  ],
  table2: [
    {
      code: 'option1',
      name: 'Table 2, option 1',
      isValid: true,
    },
    {
      code: 'option2',
      name: 'Table 2, option 2',
      isValid: true,
    },
  ],
  countries: [
    {
      code: 'nl',
      name: 'The Netherlands',
      isValid: true,
    },
    {
      code: 'gr',
      name: 'Greece',
      isValid: true,
    },
  ],
};

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
    catalogueLabel: 'VTH (RSIN: 000000000)',
    url: 'https://example.com/iotype/123',
    description: 'Vergunning',
  },
  {
    backendLabel: 'Open Zaak',
    catalogueLabel: 'VTH (RSIN: 000000000)',

    url: 'https://example.com/iotype/456',
    description: 'Vergunning',
  },
  {
    backendLabel: 'Open Zaak',
    catalogueLabel: 'VTH (RSIN: 000000000)',
    url: 'https://example.com/iotype/789',
    description: 'Ontheffing',
  },
  {
    backendLabel: 'Open Zaak',
    catalogueLabel: 'Test catalogus name',
    url: 'https://example.com/iotype/abc',
    description: 'Aanvraag',
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

export const DEFAULT_COLORS: ColorOption[] = [
  {
    color: '#4ce699',
    label: 'Aquamarine',
  },
  {
    color: '#000000',
    label: 'Black',
  },
  {
    color: '#4c4ce6',
    label: 'Blue',
  },
  {
    color: '#4c4c4c',
    label: 'Dim grey',
  },
  {
    color: '#4ce64c',
    label: 'Green',
  },
  {
    color: '#999999',
    label: 'Grey',
  },
  {
    color: '#4c99e6',
    label: 'Light blue',
  },
  {
    color: '#99e64c',
    label: 'Light green',
  },
  {
    color: '#e6e6e6',
    label: 'Light grey',
  },
  {
    color: '#e6994c',
    label: 'Orange',
  },
  {
    color: '#994ce6',
    label: 'Purple',
  },
  {
    color: '#e64c4c',
    label: 'Red',
  },
  {
    color: '#4ce6e6',
    label: 'Turquoise',
  },
  {
    color: '#ffffff',
    label: 'White',
  },
  {
    color: '#e6e64c',
    label: 'Yellow',
  },
];

export const DEFAULT_MAP_TILE_LAYERS: MapTileLayer[] = [
  {
    identifier: 'brt',
    url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png',
    label: 'BRT',
  },
  {
    identifier: 'luchtfoto',
    url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.png',
    label: 'Luchtfoto',
  },
];

export const DEFAULT_MAP_OVERLAY_TILE_LAYERS: MapOverlayTileLayer[] = [
  {
    name: 'PDOK BAG',
    uuid: 'f57405dc-1796-4f5b-8ad4-c98eb8511110',
    type: 'wms',
    url: 'https://service.pdok.nl/lv/bag/wms/v2_0?request=getCapabilities&service=WMS',
  },
  {
    name: 'PDOK grondwaterspiegeldiepte',
    uuid: '71c73427-c792-43ec-b25e-7f4f3e043fbd',
    type: 'wms',
    url: 'https://service.pdok.nl/bzk/bro-grondwaterspiegeldiepte/wms/v2_0?request=getCapabilities&service=WMS',
  },
  {
    name: 'Interactive PDOK BAG',
    uuid: 'a91d0268-f0de-48dd-9010-509df63e68ab',
    type: 'wfs',
    url: 'https://service.pdok.nl/lv/bag/wfs/v2_0?request=getCapabilities&service=WFS',
  },
];

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
