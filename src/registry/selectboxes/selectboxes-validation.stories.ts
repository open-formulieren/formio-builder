import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';

export default {
  title: 'Builder components/SelectBoxes/Validations',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wqimsadk',
      type: 'selectboxes',
      key: 'selectboxes',
      label: 'A selectboxes field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [{value: '', label: ''}],
      defaultValue: {},
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),

    builderInfo: {
      title: 'Select Boxes',
      icon: 'plus-square',
      group: 'basic',
      weight: 60,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const ManualMinimumOneValue: Story = {
  name: 'Manual values: must have at least one non-empty value',
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    await step('Option values and labels are required fields', async () => {
      // a value must be set, otherwise there's nothing to check and a label must be
      // set, otherwise there is no clickable/accessible label for an option.

      // we trigger input validation by touching the field and clearing it again
      const labelInput = canvas.getByLabelText('Option label');
      await userEvent.type(labelInput, 'Foo');
      await userEvent.clear(labelInput);

      // submit to (reliably?) trigger validation
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).not.toHaveBeenCalled();

      await waitFor(async () => {
        await expect(
          await canvas.findByText('The option label is a required field.')
        ).toBeVisible();

        await expect(
          await canvas.findByText('The option value is a required field.')
        ).toBeVisible();
      });
    });
  },
};

export const MinAndMaxSelectedInitialValues: Story = {
  name: 'Initial min and max count',
  args: {
    isNew: true,
    component: {
      id: 'wqimsadk',
      type: 'selectboxes',
      key: 'selectboxes',
      label: 'A selectboxes field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [
        {label: 'Option 1', value: '1'},
        {label: 'Option 2', value: '2'},
        {label: 'Option 3', value: '3'},
        {label: 'Option 4', value: '4'},
      ],
      defaultValue: {},
    },

    builderInfo: {
      title: 'Select Boxes',
      icon: 'plus-square',
      group: 'basic',
      weight: 60,
      schema: {},
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validation tab and provide a negative number', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      const minSelectedInput = canvas.getByLabelText('Minimum selected checkboxes');
      await userEvent.type(minSelectedInput, '-1');
      expect(minSelectedInput).toHaveValue(-1);
      await userEvent.keyboard('[Tab]');
      expect(minSelectedInput).not.toHaveFocus();
      await expect(
        await canvas.findByText('Number must be greater than or equal to 0')
      ).toBeVisible();
    });

    await step('Navigate to validation tab and provide a float number', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Validation'}));
      const maxSelectedInput = canvas.getByLabelText('Maximum selected checkboxes');
      await userEvent.type(maxSelectedInput, '1.9');
      expect(maxSelectedInput).toHaveValue(1.9);
      await userEvent.keyboard('[Tab]');
      expect(maxSelectedInput).not.toHaveFocus();
      await waitFor(async () => {
        expect(await canvas.findByText('Expected integer, received float')).toBeVisible();
      });
    });
  },
};
