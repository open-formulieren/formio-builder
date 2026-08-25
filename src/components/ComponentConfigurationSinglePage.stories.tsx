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
  title: 'Public API/ComponentConfiguration/Single page mode',
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
      label: 'A textfield for a single page form',
      tooltip: 'An example for the tooltip',
      description: 'A description for the textfield component',
    },
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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

    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
    formType: 'single_step',
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
  },
};
