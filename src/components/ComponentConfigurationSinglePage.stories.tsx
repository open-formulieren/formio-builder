import {
  AddressNLComponentSchema,
  SelectComponentSchema,
  SupportedLocales,
} from '@open-formulieren/types';
import {Meta, StoryFn, StoryObj} from '@storybook/react-vite';
import React from 'react';
import {fn} from 'storybook/test';

import {FormType} from '@/context';
import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_DOCUMENT_TYPES,
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
  title: 'Public API/ComponentConfiguration/Single page mode',
  component: ComponentConfiguration,
  args: {
    isNew: true,
    supportedLanguageCodes: ['nl'],
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
  formType: FormType;
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
  formType,
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
    formType={formType}
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
      label: 'A textfield for a single page form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the textfield component',
    },
    formType: 'single_page',
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
      label: 'An email for a single page form',
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
    formType: 'single_page',
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
      label: 'A number field for a single page form',
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
    formType: 'single_page',
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
      label: 'A textarea field for a single page form',
      autoExpand: false,
      rows: 3,
      validate: {
        required: false,
      },
    },
    formType: 'single_page',
    builderInfo: {
      title: 'Textarea',
      group: 'basic',
      icon: 'hashtag',
      schema: {placeholder: ''},
      weight: 30,
    },
  },
};

export const DateField: Story = {
  render: Template,
  name: 'type: date',
  args: {
    component: {
      id: 'wekruya',
      type: 'date',
      key: 'date',
      label: 'A date for a single page form',
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
    formType: 'single_page',
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
      label: 'A datetime field for a single page form',
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
    formType: 'single_page',
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
      label: 'A time field for a single page form',
      validate: {
        required: false,
      },
    },
    formType: 'single_page',
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
      label: 'A postcode field for a single page form',
      validate: {
        required: false,
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
    },
    formType: 'single_page',
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
      label: 'A phone number field for a single page form',
    },
    formType: 'single_page',
    builderInfo: {
      title: 'Phone number',
      icon: 'phone-square',
      group: 'basic',
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
      label: 'A selectboxes field for a single page form',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
      defaultValue: {},
    },
    formType: 'single_page',
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
      label: 'A radio for a single page form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the radio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
    },
    formType: 'single_page',
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
      label: 'A select field for a single page form',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      data: {values: []},
      defaultValue: '',
    } satisfies SelectComponentSchema,
    formType: 'single_page',
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
      label: 'A BSN field for a single page form',
      validate: {
        required: false,
      },
    },
    formType: 'single_page',
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
      label: 'A checkbox field for a single page form',
      validate: {
        required: false,
      },
      defaultValue: false,
    },
    formType: 'single_page',
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
      label: 'A currency field for a single page form',
      validate: {
        required: false,
      },
    },
    formType: 'single_page',
    builderInfo: {
      title: 'Currency',
      icon: 'eur',
      group: 'basic',
      weight: 70,
      schema: {},
    },
  },
};

export const Signature: Story = {
  render: Template,
  name: 'type: signature',

  args: {
    component: {
      id: 'wekruya',
      type: 'signature',
      key: 'signature',
      label: 'A signature field for a single page form',
      footer: '',
    },

    builderInfo: {
      title: 'Signature',
      icon: 'pencil',
      group: 'advanced',
      weight: 10,
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
      label: 'An IBAN field for a single page form',
      validate: {
        required: false,
      },
    },
    formType: 'single_page',
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
      label: 'A license plate field for a single page form',
      validate: {
        required: false,
        pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
      },
    },
    formType: 'single_page',
    builderInfo: {
      title: 'licenseplate Field',
      icon: 'wallet',
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
      label: 'A Dutch address for a single page form',
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
    formType: 'single_page',
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
      label: 'A map for a single page form',
    },
    formType: 'single_page',
    builderInfo: {
      title: 'Map',
      icon: 'map',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },
};

export const FieldSet: Story = {
  render: Template,
  name: 'type: fieldset',

  args: {
    component: {
      id: 'wekruya',
      type: 'fieldset',
      key: 'fieldset',
      label: 'A field set for a single page form',
      hideHeader: false,
      components: [],
    },

    builderInfo: {
      title: 'Field set',
      icon: 'th-large',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },
};

export const Columns: Story = {
  render: Template,
  name: 'type: columns',

  args: {
    component: {
      id: 'wekruya',
      type: 'columns',
      key: 'columns',
      columns: [],
    },

    builderInfo: {
      title: 'Columns',
      icon: 'columns',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },
};

export const Content: Story = {
  render: Template,
  name: 'type: content',

  args: {
    component: {
      id: 'wekruya',
      type: 'content',
      key: 'content',
      html: '<p>Hello storybook</p>',
    },

    builderInfo: {
      title: 'Content',
      icon: 'html5',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },
};

export const EditGrid: Story = {
  render: Template,
  name: 'type: editgrid',

  args: {
    component: {
      id: 'wekruya',
      type: 'editgrid',
      key: 'editgrid',
      label: 'A repeating group for a single page form',
      hideLabel: false,
      groupLabel: 'Group',
      disableAddingRemovingRows: false,
      components: [],
    },

    builderInfo: {
      title: 'Repeating group',
      icon: 'repeat',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },
};
