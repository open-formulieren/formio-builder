import {
  AddressNLComponentSchema,
  SelectComponentSchema,
  SupportedLocales,
} from '@open-formulieren/types';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import React from 'react';

import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_DOCUMENT_TYPES,
  DEFAULT_FILE_TYPES,
  DEFAULT_MAP_OVERLAY_TILE_LAYERS,
  DEFAULT_MAP_TILE_LAYERS,
} from '@/tests/sharedUtils';
import {AnyComponentSchema} from '@/types';

import ComponentConfiguration from './ComponentConfiguration';
import {BuilderInfo} from './ComponentEditForm';
import {PrefillAttributeOption, PrefillPluginOption} from './builder/prefill';
import {RegistrationAttributeOption} from './builder/registration/registration-attribute';
import {ValidatorOption} from './builder/validate/validator-select';
import {
  ReferenceListsServiceOption,
  ReferenceListsTable,
  ReferenceListsTableItem,
} from './builder/values/reference-lists/types';

export default {
  title: 'Public API/ComponentConfiguration/Appointment type of form',
  component: ComponentConfiguration,
  args: {
    isNew: true,
    supportedLanguageCodes: ['nl', 'en'],
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: 'terminal',
      schema: {placeholder: ''},
      weight: 0,
    },
  },
} as Meta<typeof ComponentConfiguration>;

interface TemplateArgs {
  component: AnyComponentSchema;
  supportedLanguageCodes: SupportedLocales[];
  otherComponents: AnyComponentSchema[];
  validatorPlugins: ValidatorOption[];
  registrationAttributes: RegistrationAttributeOption[];
  prefillPlugins: PrefillPluginOption[];
  services: ReferenceListsServiceOption[];
  referenceListsTables: ReferenceListsTable[];
  referenceListsTableItems: Record<string, ReferenceListsTableItem[]>;
  prefillAttributes: Record<string, PrefillAttributeOption[]>;
  fileTypes: Array<{value: string; label: string}>;
  isNew: boolean;
  builderInfo: BuilderInfo;
  formMode: 'default' | 'appointment';
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (c: AnyComponentSchema) => void;
}

const Template: StoryFn<TemplateArgs> = ({
  component,
  otherComponents,
  validatorPlugins,
  registrationAttributes,
  prefillPlugins,
  prefillAttributes,
  services,
  supportedLanguageCodes,
  referenceListsTables,
  referenceListsTableItems,
  fileTypes,
  isNew,
  builderInfo,
  formMode,
  onCancel,
  onRemove,
  onSubmit,
}: TemplateArgs) => (
  <ComponentConfiguration
    uniquifyKey={(key: string) => key}
    supportedLanguageCodes={supportedLanguageCodes}
    theme="light"
    richTextColors={DEFAULT_COLORS}
    getFormComponents={() => otherComponents}
    getValidatorPlugins={async () => validatorPlugins}
    getRegistrationAttributes={async () => registrationAttributes}
    getServices={async () => services}
    getReferenceListsTables={async () => referenceListsTables}
    getReferenceListsTableItems={async (_, code) => referenceListsTableItems[code]}
    getPrefillPlugins={async () => prefillPlugins}
    getPrefillAttributes={async (plugin: string) => prefillAttributes[plugin]}
    getFileTypes={async () => fileTypes}
    getMapTileLayers={async () => DEFAULT_MAP_TILE_LAYERS}
    getMapOverlayTileLayers={async () => DEFAULT_MAP_OVERLAY_TILE_LAYERS}
    serverUploadLimit="50MB"
    getDocumentTypes={async () => DEFAULT_DOCUMENT_TYPES}
    getConfidentialityLevels={async () => CONFIDENTIALITY_LEVELS}
    getAuthPlugins={async () => DEFAULT_AUTH_PLUGINS}
    component={component}
    isNew={isNew}
    builderInfo={builderInfo}
    formMode={formMode}
    onCancel={onCancel}
    onRemove={onRemove}
    onSubmit={onSubmit}
  />
);

type Story = StoryObj<typeof Template>;

export const Textfield: Story = {
  render: Template,
  name: 'type: textfield',
  args: {
    component: {
      id: 'wekruya',
      type: 'textfield',
      key: 'textfield',
      label: 'A textfield in appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the textfield component',
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: '',
      schema: {placeholder: ''},
      weight: 10,
    },
  },
};

export const Email: Story = {
  render: Template,
  name: 'type: email',
  args: {
    component: {
      id: 'wekruya',
      type: 'email',
      key: 'email',
      label: 'An email in appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the email component',
    },
    builderInfo: {
      title: 'Email',
      group: 'basic',
      icon: 'at',
      schema: {placeholder: ''},
      weight: 10,
    },
    formMode: 'appointment',
  },
};

export const NumberField: Story = {
  render: Template,
  name: 'type: number',

  args: {
    component: {
      id: 'wekruya',
      type: 'number',
      key: 'number',
      label: 'A number field',
      validate: {
        required: false,
      },
    },
    builderInfo: {
      title: 'Number',
      group: 'basic',
      icon: 'hashtag',
      schema: {placeholder: ''},
      weight: 30,
    },
    formMode: 'appointment',
  },
};

export const Textarea: Story = {
  render: Template,
  name: 'type: textarea',

  args: {
    component: {
      id: 'wekruya',
      type: 'textarea',
      key: 'textarea',
      label: 'A textarea field',
      autoExpand: false,
      rows: 3,
      validate: {
        required: false,
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Textarea',
      group: 'basic',
      icon: 'hashtag',
      schema: {placeholder: ''},
      weight: 30,
    },
  },
};

export const Date: Story = {
  render: Template,
  name: 'type: date',
  args: {
    component: {
      id: 'wekruya',
      type: 'date',
      key: 'date',
      label: 'A date in appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the date component',
    },
    builderInfo: {
      title: 'Date Field',
      icon: 'calendar',
      group: 'basic',
      weight: 10,
      schema: {},
    },
    formMode: 'appointment',
  },
};

export const DateTimeField: Story = {
  render: Template,
  name: 'type: datetime',
  args: {
    component: {
      id: 'wekruya',
      type: 'datetime',
      key: 'datetime',
      label: 'A datetime field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Date/Time Field',
      icon: 'calendar-plus',
      group: 'basic',
      weight: 10,
      schema: {},
    },
    formMode: 'appointment',
  },
};

export const TimeField: Story = {
  render: Template,
  name: 'type: time',
  args: {
    component: {
      id: 'wekruya',
      type: 'time',
      key: 'time',
      label: 'A time field',
      validate: {
        required: false,
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Time Field',
      icon: 'clock-o',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const Postcode: Story = {
  render: Template,
  name: 'type: postcode (deprecated)',
  args: {
    component: {
      id: 'wekruya',
      type: 'postcode',
      key: 'postcode',
      label: 'A postcode field',
      validate: {
        required: false,
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Postcode',
      icon: 'home',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const PhoneNumber: Story = {
  render: Template,
  name: 'type: phoneNumber',
  args: {
    component: {
      id: 'wekruya',
      type: 'phoneNumber',
      key: 'phoneNumber',
      label: 'A phone number field',
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Phone number',
      icon: 'phone-square',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const FileUpload: Story = {
  render: Template,
  name: 'type: file',
  args: {
    component: {
      id: 'kiweljhr',
      type: 'file',
      key: 'file',
      label: 'A file upload',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'File upload',
      icon: '',
      group: 'file',
      weight: 10,
      schema: {},
    },
  },
};

export const SelectBoxes: Story = {
  render: Template,
  name: 'type: selectboxes',
  args: {
    component: {
      id: 'wqimsadk',
      type: 'selectboxes',
      key: 'selectboxes',
      label: 'A selectboxes field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
      defaultValue: {},
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Select Boxes',
      icon: 'plus-square',
      group: 'basic',
      weight: 60,
      schema: {},
    },
  },
};

export const Radio: Story = {
  render: Template,
  name: 'type: radio',
  args: {
    component: {
      id: 'wekruya',
      type: 'radio',
      key: 'radio',
      label: 'A radio in appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the radio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Radio',
      icon: 'dot-circle-o',
      group: 'basic',
      weight: 100,
      schema: {},
    },
  },
};

export const Select: Story = {
  render: Template,
  name: 'type: select',

  args: {
    component: {
      id: 'wqimsadk',
      type: 'select',
      key: 'select',
      label: 'A select field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      data: {values: []},
      defaultValue: '',
    } satisfies SelectComponentSchema,
    formMode: 'appointment',
    builderInfo: {
      title: 'Select',
      icon: 'th-list',
      group: 'basic',
      weight: 70,
      schema: {},
    },
  },
};

export const BSN: Story = {
  render: Template,
  name: 'type: bsn',
  args: {
    component: {
      id: 'wekruya',
      type: 'bsn',
      key: 'bsn',
      label: 'A BSN field',
      validate: {
        required: false,
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'BSN Field',
      icon: 'id-card-o',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const Checkbox: Story = {
  render: Template,
  name: 'type: checkbox',

  args: {
    component: {
      id: 'wekruya',
      type: 'checkbox',
      key: 'checkbox',
      label: 'A checkbox field',
      validate: {
        required: false,
      },
      defaultValue: false,
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Checkbox',
      icon: 'check-square',
      group: 'basic',
      weight: 50,
      schema: {},
    },
  },
};

export const Currency: Story = {
  render: Template,
  name: 'type: currency',
  args: {
    component: {
      id: 'wekruya',
      type: 'currency',
      currency: 'EUR',
      key: 'currency',
      label: 'A currency field',
      validate: {
        required: false,
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Currency',
      icon: 'eur',
      group: 'basic',
      weight: 70,
      schema: {},
    },
  },
};

export const Iban: Story = {
  render: Template,
  name: 'type: iban',
  args: {
    component: {
      id: 'wekruya',
      type: 'iban',
      key: 'iban',
      label: 'An IBAN field',
      validate: {
        required: false,
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'IBAN Field',
      icon: 'wallet',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const LicensePlate: Story = {
  render: Template,
  name: 'type: licenseplate',
  args: {
    component: {
      id: 'wekruya',
      type: 'licenseplate',
      key: 'licenseplate',
      label: 'A license plate field',
      validate: {
        required: false,
        pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
      },
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'licenseplate Field',
      icon: 'wallet',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const NpFamilyMembers: Story = {
  render: Template,
  name: 'type: npFamilyMembers',
  args: {
    component: {
      id: 'wqimsadk',
      type: 'npFamilyMembers',
      key: 'npFamilyMembers',
      label: 'An npFamilyMembers field',
      includeChildren: true,
      includePartners: false,
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'NP Family members',
      icon: 'users',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
};

export const AddressNL: Story = {
  render: Template,
  name: 'type: addressNL',
  args: {
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'A Dutch address',
      validate: {
        required: false,
      },
      deriveAddress: true,
      layout: 'singleColumn',
    } satisfies AddressNLComponentSchema,
    builderInfo: {
      title: 'Address Field',
      icon: 'home',
      group: 'basic',
      weight: 10,
      schema: {},
    },
    formMode: 'appointment',
  },
};

export const LeafletMap: Story = {
  render: Template,
  name: 'type: map',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Map',
      icon: 'map',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },
};

export const Partners: Story = {
  render: Template,
  name: 'type: partners',
  args: {
    component: {
      id: 'wekruya',
      type: 'partners',
      key: 'partners',
      label: 'Partners',
      tooltip: 'An example for the tooltip',
      description: 'A description for the Partners component',
    },
    formMode: 'appointment',
  },
};

export const Children: Story = {
  render: Template,
  name: 'type: children',
  args: {
    component: {
      id: 'wekruya',
      type: 'children',
      key: 'children',
      label: 'Children',
      enableSelection: false,
      tooltip: 'An example for the tooltip',
      description: 'A description for the Children component',
    },
    formMode: 'appointment',
  },
};

export const Profile: Story = {
  render: Template,
  name: 'type: customerProfile',
  args: {
    component: {
      id: 'wekruya',
      type: 'customerProfile',
      key: 'profile',
      label: 'Profile',
      tooltip: 'An example for the tooltip',
      description: 'A description for the Profile component',
      shouldUpdateCustomerData: true,
      digitalAddressTypes: ['email', 'phoneNumber'],
    },
    formMode: 'appointment',
    builderInfo: {
      title: 'Profile',
      icon: 'comments',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },
};
