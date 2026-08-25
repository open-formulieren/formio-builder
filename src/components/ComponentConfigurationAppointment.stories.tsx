import type {
  AddressNLComponentSchema,
  SelectComponentSchema,
  SupportedLocales,
} from '@open-formulieren/types';
import type {Meta, StoryFn, StoryObj} from '@storybook/react-vite';
import type React from 'react';
import {fn} from 'storybook/test';

import type {FormType} from '@/context';
import {
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_MAP_OVERLAY_TILE_LAYERS,
  DEFAULT_MAP_TILE_LAYERS,
} from '@/tests/sharedUtils';
import type {AnyComponentSchema} from '@/types';

import ComponentConfiguration from './ComponentConfiguration';
import type {PrefillAttributeOption, PrefillPluginOption} from './builder/prefill';
import type {RegistrationAttributeOption} from './builder/registration/registration-attribute';
import type {ValidatorOption} from './builder/validate/validator-select';
import type {
  ReferenceListsServiceOption,
  ReferenceListsTable,
  ReferenceListsTableItem,
} from './builder/values/reference-lists/types';

export default {
  title: 'Public API/ComponentConfiguration/Appointment mode',
  component: ComponentConfiguration,
  args: {
    isNew: true,
    supportedLanguageCodes: ['nl'],
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof ComponentConfiguration>;

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
  formType,
  onCancel,
  onRemove,
  onSubmit,
}: TemplateArgs) => (
  <ComponentConfiguration
    uniquifyKey={(key: string) => key}
    validateRequiredDefault={false}
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
    getAuthPlugins={async () => DEFAULT_AUTH_PLUGINS}
    component={component}
    isNew={isNew}
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
      label: 'A textfield for an appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the textfield component',
    },
    formType: 'appointment',
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
      label: 'An email for an appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the email component',
    },
    formType: 'appointment',
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
      label: 'A number field for an appointment form',
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'A textarea field for an appointment form',
      autoExpand: false,
      rows: 3,
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'A date for an appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the date component',
    },
    formType: 'appointment',
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
      label: 'A datetime field for an appointment form',
      validate: {
        required: false,
      },
    },

    formType: 'appointment',
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
      label: 'A time field for an appointment form',
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'A postcode field for an appointment form',
      validate: {
        required: false,
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
    },
    formType: 'appointment',
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
      label: 'A phone number field for an appointment form',
    },
    formType: 'appointment',
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
      label: 'A selectboxes field for an appointment form',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
      defaultValue: {},
    },
    formType: 'appointment',
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
      label: 'A radio for an appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the radio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
    },
    formType: 'appointment',
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
      label: 'A select field for an appointment form',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      data: {values: []},
      defaultValue: '',
    } satisfies SelectComponentSchema,
    formType: 'appointment',
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
      label: 'A BSN field for an appointment form',
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'A checkbox field for an appointment form',
      validate: {
        required: false,
      },
      defaultValue: false,
    },
    formType: 'appointment',
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
      label: 'A currency field for an appointment form',
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'An IBAN field for an appointment form',
      validate: {
        required: false,
      },
    },
    formType: 'appointment',
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
      label: 'A license plate field for an appointment form',
      validate: {
        required: false,
        pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
      },
    },
    formType: 'appointment',
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
      label: 'An npFamilyMembers field for an appointment form',
      includeChildren: true,
      includePartners: false,
    },
    formType: 'appointment',
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
      label: 'A Dutch address for an appointment form',
      validate: {
        required: false,
      },
      deriveAddress: true,
      layout: 'singleColumn',
    } satisfies AddressNLComponentSchema,
    formType: 'appointment',
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
      label: 'A map for an appointment form',
    },
    formType: 'appointment',
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
      label: 'Partners for an appointment form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the Partners component',
    },
    formType: 'appointment',
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
      label: 'Children for an appointment form',
      enableSelection: false,
      tooltip: 'An example for the tooltip',
      description: 'A description for the Children component',
    },
    formType: 'appointment',
  },
};
