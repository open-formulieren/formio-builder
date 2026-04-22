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
        name: 'basic',
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
        name: 'special',
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
        name: 'layout',
        components: ['content', 'fieldset', 'columns', 'softRequiredErrors'],
      },
    ],
    presets: [
      {
        label: 'Volledige naam',
        key: 'fullName',
        icon: 'terminal',
        schema: {
          label: 'Volledige naam',
          autocomplete: 'name',
          type: 'textfield',
          id: 'fullName',
          key: 'fullName',
        },
      },
      {
        label: 'Voornaam',
        key: 'firstName',
        icon: 'terminal',
        schema: {
          label: 'Voornaam',
          autocomplete: 'given-name',
          type: 'textfield',
          key: 'firstName',
          id: 'firstName',
        },
      },
      {
        label: 'Achternaam',
        key: 'lastName',
        icon: 'terminal',
        schema: {
          label: 'Achternaam',
          autocomplete: 'family-name',
          type: 'textfield',
          key: 'lastName',
          id: 'lastName',
        },
      },
      {
        label: 'Adresregel 1',
        key: 'addressLine1',
        icon: 'home',
        schema: {
          label: 'Adresregel 1',
          autocomplete: 'address-line1',
          type: 'textfield',
          key: 'addressLine1',
          id: 'addressLine1',
        },
      },
      {
        label: 'Adresregel 2',
        key: 'addressLine2',
        icon: 'home',
        schema: {
          label: 'Adresregel 2',
          autocomplete: 'address-line2',
          type: 'textfield',
          key: 'addressLine2',
          id: 'addressLine2',
        },
      },
      {
        label: 'Adresregel 3',
        key: 'addressLine3',
        icon: 'home',
        schema: {
          label: 'Adresregel 3',
          autocomplete: 'address-line3',
          type: 'textfield',
          key: 'addressLine3',
          id: 'addressLine3',
        },
      },
      {
        label: 'Postcode',
        key: 'postalcode',
        icon: 'home',
        schema: {
          label: 'Postcode',
          type: 'postcode',
          key: 'postalcode',
          id: 'postalcode',
          validate: {
            pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
          },
        },
      },
      {
        label: 'E-mailadres',
        key: 'email',
        icon: 'at',
        schema: {
          label: 'E-mailadres',
          autocomplete: 'email',
          key: 'email',
          type: 'email',
          id: 'email',
        },
      },
      {
        label: 'Telefoonnummer',
        key: 'phoneNumber',
        icon: 'phone-square',
        schema: {
          label: 'Telefoonnummer',
          autocomplete: 'tel',
          id: 'phoneNumber',
          key: 'phoneNumber',
          type: 'phoneNumber',
        },
      },
      {
        label: 'Website',
        key: 'url',
        icon: 'link',
        schema: {
          label: 'Website',
          id: 'url',
          autocomplete: 'url',
          type: 'textfield',
          key: 'url',
        },
      },
    ],
  },
} satisfies Meta<typeof ComponentsList>;

type Story = StoryObj<typeof ComponentsList>;

export const Default: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const regularFieldsContainer = canvas.getByTestId('component-group--basic');
    const specialFieldsContainer = canvas.getByTestId('component-group--special');
    const layoutFieldsContainer = canvas.getByTestId('component-group--layout');
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
      const formFieldsContainer = within(canvas.getByTestId('component-group--basic'));
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

    const regularFieldsContainer = canvas.getByTestId('component-group--basic');
    const specialFieldsContainer = canvas.getByTestId('component-group--special');
    const layoutFieldsContainer = canvas.getByTestId('component-group--layout');
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
      const formFieldsContainer = within(canvas.getByTestId('component-group--basic'));
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

export const NoSearchResults: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByRole('searchbox');
    expect(searchInput).toBeVisible();

    const regularFieldsContainer = canvas.getByTestId('component-group--basic');
    const specialFieldsContainer = canvas.getByTestId('component-group--special');
    const layoutFieldsContainer = canvas.getByTestId('component-group--layout');
    const presetFieldsContainer = canvas.getByTestId('component-group--preset');

    step('Initial state', () => {
      // Expect all component groups to be in the DOM.
      const regularFieldsPanelButton = within(regularFieldsContainer).getByText('Form fields');
      const specialFieldsPanelButton = within(specialFieldsContainer).getByText('Special fields');
      const layoutFieldsPanelButton = within(layoutFieldsContainer).getByText('Layout');
      const presetFieldsPanelButton = within(presetFieldsContainer).getByText('Preset');

      // All component groups are visible
      expect(regularFieldsPanelButton).toBeVisible();
      expect(specialFieldsPanelButton).toBeVisible();
      expect(layoutFieldsPanelButton).toBeVisible();
      expect(presetFieldsPanelButton).toBeVisible();
    });

    await step('Search for nonexistent component', async () => {
      // Search for a component that does not exist
      await userEvent.type(searchInput, 'Nonexistent component');

      // As none of the groups have any components, all are hidden/removed from the DOM.
      expect(regularFieldsContainer).not.toBeInTheDocument();
      expect(specialFieldsContainer).not.toBeInTheDocument();
      expect(layoutFieldsContainer).not.toBeInTheDocument();
      expect(presetFieldsContainer).not.toBeInTheDocument();

      // The "no results found" message is shown.
      const noResultsMessage = await canvas.findByText('No matching components found.');
      expect(noResultsMessage).toBeVisible();
    });
  },
};
