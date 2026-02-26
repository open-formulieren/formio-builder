import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, userEvent, waitFor, within} from 'storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {withFormik} from '@/sb-decorators';

export default {
  title: 'Builder components/DateTimeField',
  component: ComponentEditForm,
  decorators: [withFormik],
  parameters: {},
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'datetime',
      key: 'datetime',
      label: 'A datetime field',
      validate: {
        required: false,
      },
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),

    builderInfo: {
      title: 'Date/Time Field',
      icon: 'calendar-plus',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const ValidateDeltaConstraintConfiguration: Story = {
  name: 'Validate datetime constraint configuration: delta',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open maxDate configuration', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getByText(/Maximum date/));
      await waitFor(async () => {
        expect(await canvas.findByText('Mode preset')).toBeVisible();
      });
    });

    await step('Configure relative to variable', async () => {
      canvas.getByLabelText('Mode preset').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('Relative to variable'));

      // set up an invalid variable name
      const variableInput = await canvas.findByLabelText('Variable');
      expect(variableInput).toBeVisible();
      expect(variableInput).toHaveDisplayValue('now');
      await userEvent.clear(variableInput);
      await userEvent.type(variableInput, 'invalid because spaces');

      // enter invalid values for the delta
      const yearInput = await canvas.findByLabelText('Years');
      expect(yearInput).toHaveDisplayValue('');
      await userEvent.type(yearInput, '3.14');

      const monthInput = await canvas.findByLabelText('Months');
      expect(monthInput).toHaveDisplayValue('');
      await userEvent.type(monthInput, '-3');

      const dayInput = await canvas.findByLabelText('Days');
      expect(dayInput).toHaveDisplayValue('');
      await userEvent.type(dayInput, '0');
      await userEvent.keyboard('[Tab]');
      expect(dayInput).not.toHaveFocus();
    });

    await step('Check the validation errors', async () => {
      expect(await canvas.findByText(/The property name must only contain/)).toBeVisible();
      expect(await canvas.findByText('Expected integer, received float')).toBeVisible();
      expect(await canvas.findByText('Number must be greater than or equal to 0')).toBeVisible();
    });
  },
};

export const ValidateFixedValueConfiguration: Story = {
  name: 'Validate datetime constraint configuration: fixed value',
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and open minDate configuration', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      await userEvent.click(canvas.getByText(/Minimum date/));
      await waitFor(async () => {
        expect(await canvas.findByText('Mode preset')).toBeVisible();
      });
    });

    await step('Configure fixed value', async () => {
      canvas.getByLabelText('Mode preset').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('Fixed value'));

      const dateTimeInput = canvas.getByLabelText<HTMLInputElement>('Minimum date');
      // interaction with type="date" is not nice yet in testing-library
      await userEvent.type(dateTimeInput, '2024-01-01T10:00');
      expect(dateTimeInput).toHaveValue('2024-01-01T10:00');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};
