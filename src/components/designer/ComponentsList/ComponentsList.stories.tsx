import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import ComponentsList from './ComponentsList';

export default {
  title: 'Form designer/ComponentsList',
  component: ComponentsList,
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
  },
  args: {
    groups: [
      {
        default: true,
        title: 'Formuliervelden',
        name: 'custom',
        weight: 0,
        components: [
          'textfield',
          'textarea',
          'checkbox',
          'selectboxes',
          'select',
          'radio',
          'number',
          'currency',
          'email',
          'date',
          'datetime',
          'time',
          'phoneNumber',
          'postcode',
          'file',
        ],
      },
      {
        title: 'Special fields',
        name: 'custom_special',
        weight: 5,
        components: [
          'iban',
          'licenseplate',
          'bsn',
          'npFamilyMembers',
          'signature',
          'cosign',
          'coSign',
          'map',
          'editgrid',
          'addressNL',
          'partners',
          'children',
          'customerProfile',
        ],
      },
      {
        title: 'Opmaak',
        name: 'custom_layout',
        weight: 5,
        components: ['content', 'fieldset', 'columns', 'softRequiredErrors'],
      },
    ],
    presets: [
      {
        title: 'Volledige naam',
        key: 'fullName',
        icon: 'terminal',
        schema: {
          label: 'Volledige naam',
          autocomplete: 'name',
          type: 'textfield',
          key: 'fullName',
          input: true,
        },
      },
      {
        title: 'Voornaam',
        key: 'firstName',
        icon: 'terminal',
        schema: {
          label: 'Voornaam',
          autocomplete: 'given-name',
          type: 'textfield',
          key: 'firstName',
          input: true,
        },
      },
      {
        title: 'Achternaam',
        key: 'lastName',
        icon: 'terminal',
        schema: {
          label: 'Achternaam',
          autocomplete: 'family-name',
          type: 'textfield',
          key: 'lastName',
          input: true,
        },
      },
      {
        title: 'Adresregel 1',
        key: 'addressLine1',
        icon: 'home',
        schema: {
          label: 'Adresregel 1',
          autocomplete: 'address-line1',
          type: 'textfield',
          key: 'addressLine1',
          input: true,
        },
      },
      {
        title: 'Adresregel 2',
        key: 'addressLine2',
        icon: 'home',
        schema: {
          label: 'Adresregel 2',
          autocomplete: 'address-line2',
          type: 'textfield',
          key: 'addressLine2',
          input: true,
        },
      },
      {
        title: 'Adresregel 3',
        key: 'addressLine3',
        icon: 'home',
        schema: {
          label: 'Adresregel 3',
          autocomplete: 'address-line3',
          type: 'textfield',
          key: 'addressLine3',
          input: true,
        },
      },
      {
        title: 'Postcode',
        key: 'postalcode',
        icon: 'home',
        schema: {
          label: 'Postcode',
          autocomplete: 'postal-code',
          type: 'postcode',
          key: 'postalcode',
          input: true,
          inputMask: '9999 AA',
          validateOn: 'blur',
          validate: {
            customMessage: 'Invalid Postcode',
            pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
          },
        },
      },
      {
        title: 'E-mailadres',
        key: 'email',
        icon: 'at',
        schema: {
          label: 'E-mailadres',
          autocomplete: 'email',
          tableView: true,
          key: 'email',
          type: 'email',
          input: true,
        },
      },
      {
        title: 'Telefoonnummer',
        key: 'phoneNumber',
        icon: 'phone-square',
        schema: {
          label: 'Telefoonnummer',
          autocomplete: 'tel',
          tableView: true,
          key: 'phoneNumber',
          type: 'phoneNumber',
          input: true,
        },
      },
      {
        title: 'Website',
        key: 'url',
        icon: 'link',
        schema: {
          label: 'Website',
          autocomplete: 'url',
          type: 'textfield',
          key: 'url',
          input: true,
        },
      },
    ],
    components: {
      textarea: {
        type: 'textarea',
        builderInfo: {
          title: 'Text Area',
          group: 'basic',
          icon: 'font',
          documentation: '/userguide/#textarea',
          weight: 20,
          schema: {
            id: 'eqegfc',
            type: 'textarea',
            key: 'textarea',
            label: 'Some input',
            rows: 3,
            autoExpand: true,
          },
        },
      },
      textfield: {
        type: 'textfield',
        builderInfo: {
          title: 'Text Field',
          icon: 'terminal',
          group: 'basic',
          documentation: '/userguide/#textfield',
          weight: 0,
          schema: {
            id: 'eqegfc',
            type: 'textfield',
            key: 'textfield',
            label: 'Some input',
          },
        },
      },
      checkbox: {
        type: 'checkbox',
        builderInfo: {
          title: 'Checkbox',
          group: 'basic',
          icon: 'check-square',
          documentation: '/userguide/#checkbox',
          weight: 50,
          schema: {
            id: 'yejak',
            type: 'checkbox',
            key: 'someCheckbox',
            label: 'Some checkbox',
          },
        },
      },
      iban: {
        type: 'iban',
        builderInfo: {
          title: 'IBAN Field',
          icon: 'wallet',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'iban',
            key: 'someIban',
            label: 'Some IBAN',
          },
        },
      },
      date: {
        type: 'date',
        builderInfo: {
          title: 'Date Field',
          icon: 'calendar',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'ezftxdl',
            type: 'date',
            key: 'someDate',
            label: 'Some date',
          },
        },
      },
      datetime: {
        type: 'datetime',
        builderInfo: {
          title: 'Date / Time',
          icon: 'calendar-plus',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'ezftxdl',
            type: 'datetime',
            key: 'someDatetime',
            label: 'Some datetime',
          },
        },
      },
      signature: {
        type: 'signature',
        builderInfo: {
          title: 'Signature',
          group: 'advanced',
          icon: 'pencil',
          weight: 120,
          documentation: '/userguide/#signature',
          schema: {
            id: 'yejak',
            type: 'signature',
            key: 'someSignature',
            label: 'Some signature',
          },
        },
      },
      time: {
        type: 'time',
        builderInfo: {
          title: 'Time',
          icon: 'clock-o',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'ezftxdl',
            type: 'time',
            key: 'someTime',
            label: 'Some time',
          },
        },
      },
      number: {
        type: 'number',
        builderInfo: {
          title: 'Number',
          icon: 'hashtag',
          group: 'basic',
          documentation: '/userguide/#number',
          weight: 30,
          schema: {
            id: 'ezftxdl',
            type: 'number',
            key: 'someNumber',
            label: 'Some number',
          },
        },
      },
      phoneNumber: {
        type: 'phoneNumber',
        builderInfo: {
          title: 'Phone Number Field',
          icon: 'phone-square',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'phoneNumber',
            key: 'someInput',
            label: 'Some input',
          },
        },
      },
      bsn: {
        type: 'bsn',
        builderInfo: {
          title: 'BSN Field',
          icon: 'id-card-o',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'bsn',
            key: 'someInput',
            label: 'Some input',
          },
        },
      },
      postcode: {
        type: 'postcode',
        builderInfo: {
          title: 'Postcode Field',
          icon: 'home',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'postcode',
            key: 'someInput',
            label: 'Some input',
            validate: {
              pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
            },
          },
        },
      },
      file: {
        type: 'file',
        builderInfo: {
          title: 'File Upload',
          icon: 'file',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'file',
            key: 'someFile',
            label: 'Attachment',
            file: {
              name: '',
              type: [],
              allowedTypesLabels: [],
            },
            filePattern: '*',
          },
        },
      },
      select: {
        type: 'select',
        builderInfo: {
          title: 'Select',
          group: 'basic',
          icon: 'th-list',
          weight: 70,
          documentation: '/userguide/#select',
          schema: {
            id: 'yejak',
            type: 'select',
            key: 'someSelect',
            label: 'Some select',
            openForms: {
              dataSrc: 'manual',
              translations: {},
            },
            data: {
              values: [
                {
                  value: 'dummy',
                  label: 'dummy',
                },
              ],
            },
          },
        },
      },
      radio: {
        type: 'radio',
        builderInfo: {
          title: 'Radio',
          group: 'basic',
          icon: 'dot-circle-o',
          weight: 80,
          documentation: '/userguide/forms/form-components#radio',
          schema: {
            id: 'yejak',
            type: 'radio',
            key: 'aRadio',
            label: 'A radio',
            defaultValue: null,
            openForms: {
              dataSrc: 'manual',
              translations: {},
            },
            values: [
              {
                value: 'dummy',
                label: 'dummy',
              },
            ],
          },
        },
      },
      selectboxes: {
        type: 'selectboxes',
        builderInfo: {
          title: 'Select Boxes',
          group: 'basic',
          icon: 'plus-square',
          weight: 60,
          documentation: '/userguide/#selectboxes',
          schema: {
            id: 'yejak',
            type: 'selectboxes',
            key: 'someSelectboxes',
            label: 'Some selectboxes',
            defaultValue: {},
            openForms: {
              dataSrc: 'manual',
              translations: {},
            },
            values: [
              {
                value: 'dummy',
                label: 'dummy',
              },
            ],
          },
        },
      },
      email: {
        type: 'email',
        builderInfo: {
          title: 'Email',
          group: 'advanced',
          icon: 'at',
          documentation: '/userguide/#email',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'email',
            key: 'someEmail',
            label: 'Some email',
          },
        },
      },
      fieldset: {
        type: 'fieldset',
        builderInfo: {
          title: 'Field Set',
          icon: 'th-large',
          group: 'layout',
          documentation: '/userguide/#fieldset',
          weight: 20,
          schema: {
            id: 'eqegfc',
            type: 'fieldset',
            key: 'fieldset',
            label: 'Fieldset',
            hideHeader: false,
            components: [],
          },
        },
      },
      licenseplate: {
        type: 'licenseplate',
        builderInfo: {
          title: 'License plate',
          icon: 'car',
          group: 'basic',
          weight: 10,
          schema: {
            id: 'yejak',
            type: 'licenseplate',
            key: 'someInput',
            label: 'Some input',
            validate: {
              pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
            },
          },
        },
      },
      map: {
        type: 'map',
        builderInfo: {
          title: 'Map',
          icon: 'map',
          group: 'basic',
          weight: 500,
          schema: {id: 'yejak', type: 'map', key: 'someMap', label: 'Some map'},
        },
      },
      coSign: {
        type: 'coSign',
        builderInfo: {
          title: 'Co-sign (Old)',
          icon: 'id-card-o',
          group: 'basic',
          weight: 300,
          schema: {
            id: 'yejak',
            type: 'coSign',
            key: 'someCoSign',
            label: 'Some cosign',
            authPlugin: 'digid',
          },
        },
      },
      cosign: {
        type: 'cosign',
        builderInfo: {
          title: 'Co-sign',
          group: 'advanced',
          icon: 'pen-nib',
          weight: 300,
          schema: {id: 'yejak', type: 'cosign', key: 'someCoSign', label: 'Some cosign'},
        },
      },
      npFamilyMembers: {
        type: 'npFamilyMembers',
        builderInfo: {
          title: 'Family members',
          icon: 'users',
          group: 'basic',
          weight: 10,
          schema: {
            id: '123',
            type: 'npFamilyMembers',
            key: 'aFamilyMembers',
            label: 'A Family Members',
            includeChildren: true,
            includePartners: true,
          },
        },
      },
      columns: {
        type: 'columns',
        builderInfo: {
          title: 'Columns',
          icon: 'columns',
          group: 'layout',
          documentation: '/userguide/#columns',
          weight: 10,
          schema: {id: 'eqegfc', type: 'columns', key: 'columns', columns: []},
        },
      },
      content: {
        type: 'content',
        builderInfo: {
          title: 'Content',
          group: 'layout',
          icon: 'html5',
          preview: false,
          documentation: '/userguide/#content-component',
          weight: 5,
          schema: {id: 'eqegfc', type: 'content', html: '', key: 'content'},
        },
      },
      currency: {
        type: 'currency',
        builderInfo: {
          title: 'Currency',
          group: 'advanced',
          icon: 'usd',
          documentation: '/userguide/#currency',
          weight: 70,
          schema: {
            id: '123',
            type: 'currency',
            key: 'aCurrency',
            label: 'A currency',
            currency: 'EUR',
          },
        },
      },
      editgrid: {
        type: 'editgrid',
        builderInfo: {
          hideLabel: false,
          title: 'Repeating Group',
          icon: 'repeat',
          group: 'advanced',
          weight: 300,
          schema: {
            id: 'yejak',
            type: 'editgrid',
            key: 'someEditGrid',
            label: 'Some edit grid',
            components: [],
            disableAddingRemovingRows: false,
            groupLabel: 'Item',
          },
        },
      },
      addressNL: {
        type: 'addressNL',
        builderInfo: {
          title: 'AddressNL',
          icon: 'home',
          group: 'custom_special',
          weight: 300,
          schema: {
            id: 'yejak',
            type: 'addressNL',
            key: 'someAddressNL',
            label: 'Some AddressNL',
            deriveAddress: false,
            layout: 'doubleColumn',
          },
        },
      },
      softRequiredErrors: {
        type: 'softRequiredErrors',
        builderInfo: {
          title: 'Soft required errors',
          icon: 'triangle-exclamation',
          group: 'custom_layout',
          weight: 900,
          schema: {
            type: 'softRequiredErrors',
            id: 'iitral8',
            key: 'someKey',
            html: '<div>Will need to be properly {{ field_errors }} structured.</div>',
          },
        },
      },
      partners: {
        type: 'partners',
        builderInfo: {
          title: 'Partners',
          icon: 'users',
          group: 'custom_special',
          weight: 300,
          schema: {
            id: 'yejak',
            type: 'partners',
            key: 'partners',
            label: 'Partners',
          },
        },
      },
      children: {
        type: 'children',
        builderInfo: {
          title: 'Children',
          icon: 'children',
          group: 'custom_special',
          weight: 300,
          schema: {
            id: 'yejak',
            type: 'children',
            key: 'children',
            label: 'children',
            enableSelection: false,
          },
        },
      },
      customerProfile: {
        type: 'customerProfile',
        builderInfo: {
          title: 'Profile',
          icon: 'comments',
          group: 'custom_special',
          weight: 300,
          schema: {
            id: '123',
            type: 'customerProfile',
            key: 'customerProfile',
            label: 'Customer profile',
            digitalAddressTypes: ['email', 'phoneNumber'],
            shouldUpdateCustomerData: false,
          },
        },
      },
    },
  },
} as Meta<typeof ComponentsList>;

type Story = StoryObj<typeof ComponentsList>;

export const Default: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const regularFieldsContainer = canvas.getByTestId('component-group--custom');
    const specialFieldsContainer = canvas.getByTestId('component-group--custom_special');
    const layoutFieldsContainer = canvas.getByTestId('component-group--custom_layout');
    const presetFieldsContainer = canvas.getByTestId('component-group--preset');

    const regularFieldsPanelButton = within(regularFieldsContainer).getByText('Form fields');
    const specialFieldsPanelButton = within(specialFieldsContainer).getByText('Special fields');
    const layoutFieldsPanelButton = within(layoutFieldsContainer).getByText('Layout');
    const presetFieldsPanelButton = within(presetFieldsContainer).getByText('Preset');

    // All component groups are visible
    expect(regularFieldsPanelButton).toBeVisible();
    expect(specialFieldsPanelButton).toBeVisible();
    expect(layoutFieldsPanelButton).toBeVisible();
    expect(presetFieldsPanelButton).toBeVisible();

    await step('Initial state', () => {
      // Expect the regular fields panel to be opened, and all others to be closed
      expect(regularFieldsContainer).toHaveAttribute('open');
      expect(specialFieldsContainer).not.toHaveAttribute('open');
      expect(layoutFieldsContainer).not.toHaveAttribute('open');
      expect(presetFieldsContainer).not.toHaveAttribute('open');
    });

    await step('Validating components in "Formuliervelden" group', () => {
      // The 'Formuliervelden' group should display 15 components
      const formFieldsContainer = within(canvas.getByTestId('component-group--custom'));
      const formFieldsList = within(formFieldsContainer.getByRole('list'));

      expect(formFieldsList.getAllByRole('button')).toHaveLength(15);

      expect(formFieldsList.getByRole('button', {name: 'Textfield'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Textarea'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Checkbox'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Selectboxes'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Select'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Radio'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Number'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Currency'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Email'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Date'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Date & time'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Time'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Phone number'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Postcode'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'File upload'})).toBeVisible();
    });

    await step('Validating components in "Special fields" group', async () => {
      // Toggle the special fields panel
      await userEvent.click(specialFieldsPanelButton);

      // Expect the previous panel to close and the current to open
      expect(regularFieldsContainer).not.toHaveAttribute('open');
      expect(specialFieldsContainer).toHaveAttribute('open');

      // The special fields group should display 12 components
      const specialFieldsList = within(within(specialFieldsContainer).getByRole('list'));

      expect(specialFieldsList.getAllByRole('button')).toHaveLength(13);

      expect(specialFieldsList.getByRole('button', {name: 'IBAN'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'License plate'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'BSN'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Family members'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Signature'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Co-sign'})).toBeVisible();
      // There should be a co-sign component with a 'deprecated' marker.
      expect(specialFieldsList.getByRole('button', {name: 'Co-sign Deprecated'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Map'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Repeating group'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'AddressNL'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Partners'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Children'})).toBeVisible();
      expect(specialFieldsList.getByRole('button', {name: 'Profile'})).toBeVisible();
    });

    await step('Validating components in "layout fields" group', async () => {
      // Toggle the layout fields panel
      await userEvent.click(layoutFieldsPanelButton);

      // Expect the previous panel to close and the current to open
      expect(specialFieldsContainer).not.toHaveAttribute('open');
      expect(layoutFieldsContainer).toHaveAttribute('open');

      // The layout fields group should display 4 components
      const layoutFieldsList = within(within(layoutFieldsContainer).getByRole('list'));

      expect(layoutFieldsList.getAllByRole('button')).toHaveLength(4);

      expect(layoutFieldsList.getByRole('button', {name: 'Content'})).toBeVisible();
      expect(layoutFieldsList.getByRole('button', {name: 'Fieldset'})).toBeVisible();
      expect(layoutFieldsList.getByRole('button', {name: 'Columns'})).toBeVisible();
      expect(layoutFieldsList.getByRole('button', {name: 'Soft required errors'})).toBeVisible();
    });

    await step('Validating components in "preset fields" group', async () => {
      // Toggle the preset fields panel
      await userEvent.click(presetFieldsPanelButton);

      // Expect the previous panel to close and the current to open
      expect(layoutFieldsContainer).not.toHaveAttribute('open');
      expect(presetFieldsContainer).toHaveAttribute('open');

      // The preset fields group should display 10 components
      const presetFieldsList = within(within(presetFieldsContainer).getByRole('list'));

      expect(presetFieldsList.getAllByRole('button')).toHaveLength(10);

      expect(presetFieldsList.getByRole('button', {name: 'Volledige naam'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Voornaam'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Achternaam'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Adresregel 1'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Adresregel 2'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Adresregel 3'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Postcode'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'E-mailadres'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Telefoonnummer'})).toBeVisible();
      expect(presetFieldsList.getByRole('button', {name: 'Website'})).toBeVisible();
    });

    // Return the default panel
    await userEvent.click(regularFieldsPanelButton);
  },
};

export const SearchForComponents: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByRole('searchbox');
    expect(searchInput).toBeVisible();

    const regularFieldsContainer = canvas.getByTestId('component-group--custom');
    const specialFieldsContainer = canvas.getByTestId('component-group--custom_special');
    const layoutFieldsContainer = canvas.getByTestId('component-group--custom_layout');
    const presetFieldsContainer = canvas.getByTestId('component-group--preset');

    await step('Initial state', () => {
      // Expect search input to be empty
      expect(searchInput).toHaveValue('');

      // Expect all component groups are displayed
      const regularFieldsPanelButton = within(regularFieldsContainer).getByText('Form fields');
      const specialFieldsPanelButton = within(specialFieldsContainer).getByText('Special fields');
      const layoutFieldsPanelButton = within(layoutFieldsContainer).getByText('Layout');
      const presetFieldsPanelButton = within(presetFieldsContainer).getByText('Preset');

      // All component groups are visible
      expect(regularFieldsPanelButton).toBeVisible();
      expect(specialFieldsPanelButton).toBeVisible();
      expect(layoutFieldsPanelButton).toBeVisible();
      expect(presetFieldsPanelButton).toBeVisible();

      // Only the 'Formuliervelden' group is expanded
      expect(regularFieldsContainer).toHaveAttribute('open');
      expect(specialFieldsContainer).not.toHaveAttribute('open');
      expect(layoutFieldsContainer).not.toHaveAttribute('open');
      expect(presetFieldsContainer).not.toHaveAttribute('open');

      // The 'Formuliervelden' group should display all 15 components
      const formFieldsContainer = within(canvas.getByTestId('component-group--custom'));
      const formFieldsList = within(formFieldsContainer.getByRole('list'));

      expect(formFieldsList.getAllByRole('button')).toHaveLength(15);
    });

    // Validate the results when searching
    await step('Searching for components using the letter "b"', async () => {
      // Expect all component groups are opened and the options to be filtered
      await userEvent.type(searchInput, 'b');

      const regularFieldsPanelButton = await within(regularFieldsContainer).findByText(
        'Form fields'
      );
      const specialFieldsPanelButton = await within(specialFieldsContainer).findByText(
        'Special fields'
      );
      const layoutFieldsPanelButton = within(layoutFieldsContainer).queryByText('Layout');
      const presetFieldsPanelButton = await within(presetFieldsContainer).findByText('Preset');

      // Some groups are visible
      expect(regularFieldsPanelButton).toBeVisible();
      expect(specialFieldsPanelButton).toBeVisible();
      expect(presetFieldsPanelButton).toBeVisible();
      expect(layoutFieldsPanelButton).not.toBeInTheDocument();

      // All visible groups are expanded
      expect(regularFieldsContainer).toHaveAttribute('open');
      expect(specialFieldsContainer).toHaveAttribute('open');
      expect(presetFieldsContainer).toHaveAttribute('open');

      // Validate the components available in 'Form fields' group
      const formFieldsList = within(within(regularFieldsContainer).getByRole('list'));

      expect(formFieldsList.getAllByRole('button')).toHaveLength(4);
      expect(formFieldsList.getByRole('button', {name: 'Checkbox'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Selectboxes'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Number'})).toBeVisible();
      expect(formFieldsList.getByRole('button', {name: 'Phone number'})).toBeVisible();

      // Validate the components available in 'Special fields' group
      const specialList = within(within(specialFieldsContainer).getByRole('list'));

      expect(specialList.getAllByRole('button')).toHaveLength(3);
      expect(specialList.getByRole('button', {name: 'IBAN'})).toBeVisible();
      expect(specialList.getByRole('button', {name: 'BSN'})).toBeVisible();
      expect(specialList.getByRole('button', {name: 'Family members'})).toBeVisible();

      // Validate the components available in 'Preset' group
      const presetList = within(within(presetFieldsContainer).getByRole('list'));

      expect(presetList.getAllByRole('button')).toHaveLength(2);
      expect(presetList.getByRole('button', {name: 'Telefoonnummer'})).toBeVisible();
      expect(presetList.getByRole('button', {name: 'Website'})).toBeVisible();
    });
  },
};
