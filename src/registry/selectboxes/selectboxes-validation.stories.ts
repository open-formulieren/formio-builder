import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Option values and labels are required fields', async () => {
      // a value must be set, otherwise there's nothing to check and a label must be
      // set, otherwise there is no clickable/accessible label for an option.

      // we trigger input validation by touching the field and clearing it again
      const labelInput = canvas.getByLabelText('Option label');
      await userEvent.type(labelInput, 'Foo');
      await userEvent.clear(labelInput);
      await userEvent.keyboard('[Tab]');
      await expect(await canvas.findByText('The option label is a required field.')).toBeVisible();
      await expect(await canvas.findByText('The option value is a required field.')).toBeVisible();
    });
  },
};
