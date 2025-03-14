import {Meta, StoryObj} from '@storybook/react';
import {expect, fireEvent, userEvent, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/Columns/Validations',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,

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
} satisfies Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const SumOfColumnSizes: Story = {
  name: 'Column widths: sum <= 12',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    // add a third column
    await userEvent.click(canvas.getByRole('button', {name: 'Add column'}));
    await preview.findByText('Column 3');

    // set the column widths to total size > 12
    const sliders = await canvas.findAllByRole('slider', {
      name: 'Column size, value between 1 and 12.',
    });
    fireEvent.change(sliders[0], {target: {value: 5}});
    fireEvent.change(sliders[1], {target: {value: 5}});
    fireEvent.change(sliders[2], {target: {value: 4}});

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    await expect(
      await canvas.findByText('The sum of column sizes may not exceed 12.')
    ).toBeVisible();
  },
};
