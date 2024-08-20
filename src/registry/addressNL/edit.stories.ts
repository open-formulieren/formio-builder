import {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/AddressNL',
  component: ComponentEditForm,
  parameters: {},
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'An address field',
    },
    builderInfo: {
      title: 'Address NL',
      icon: 'home',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const PostcodeValidationTabWithoutConfiguration: Story = {
  name: 'AddressNL postcode validation tab (no prior configuration)',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open Postcode validation', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getAllByText('Postcode')[0]);
      expect(await canvas.findByLabelText('Regular expression for postcode')).toBeVisible();
      expect(await canvas.findByText('NL')).toBeVisible();
      expect(await canvas.findByText('EN')).toBeVisible();
      expect(await canvas.findByText('Error code')).toBeVisible();
      const errorMessageInput = await canvas.findByLabelText('Error message for "pattern"');
      expect(errorMessageInput).toHaveDisplayValue('');
    });
  },
};

export const CityValidationTabWithoutConfiguration: Story = {
  name: 'AddressNL city validation tab (no prior configuration)',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open City validation', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getAllByText('City')[0]);
      expect(await canvas.findByLabelText('Regular expression for city')).toBeVisible();
      expect(await canvas.findByText('NL')).toBeVisible();
      expect(await canvas.findByText('EN')).toBeVisible();
      expect(await canvas.findByText('Error code')).toBeVisible();
      const errorMessageInput = await canvas.findByLabelText('Error message for "pattern"');
      expect(errorMessageInput).toHaveDisplayValue('');
    });
  },
};

export const PostcodeValidationTabWithConfiguration: Story = {
  name: 'AddressNL postcode validation tab (with prior configuration)',
  args: {
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'An address field',
      openForms: {
        components: {
          postcode: {
            validate: {
              pattern: '1017 [A-Za-z]{2}',
            },
            translatedErrors: {
              nl: {pattern: 'Postcode moet 1017 XX zijn'},
              en: {pattern: 'Postal code must be 1017 XX'},
            },
          },
        },
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open Postcode validation', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getAllByText('Postcode')[0]);
      const patternInput = await canvas.findByLabelText('Regular expression for postcode');
      expect(patternInput).toBeVisible();
      expect(patternInput).toHaveValue('1017 [A-Za-z]{2}');

      expect(await canvas.findByDisplayValue('pattern')).toBeVisible();
      expect(await canvas.findByDisplayValue('Postcode moet 1017 XX zijn')).toBeVisible();

      await userEvent.click(await canvas.findByText('EN'));
      const errorMessageInput = await canvas.findByLabelText('Error message for "pattern"');
      expect(errorMessageInput).toHaveDisplayValue('Postal code must be 1017 XX');
    });
  },
};

export const CityValidationTabWithConfiguration: Story = {
  name: 'AddressNL city validation tab (with prior configuration)',
  args: {
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'An address field',
      openForms: {
        components: {
          city: {
            validate: {
              pattern: 'Amsterdam',
            },
            translatedErrors: {
              nl: {pattern: 'De stad moet Amsterdam zijn'},
              en: {pattern: 'The city must be Amsterdam'},
            },
          },
        },
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open City validation', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getAllByText('City')[0]);
      const patternInput = await canvas.findByLabelText('Regular expression for city');
      expect(patternInput).toBeVisible();
      expect(patternInput).toHaveValue('Amsterdam');

      expect(await canvas.findByDisplayValue('pattern')).toBeVisible();
      expect(await canvas.findByDisplayValue('De stad moet Amsterdam zijn')).toBeVisible();

      await userEvent.click(await canvas.findByText('EN'));
      const errorMessageInput = await canvas.findByLabelText('Error message for "pattern"');
      expect(errorMessageInput).toHaveDisplayValue('The city must be Amsterdam');
    });
  },
};
