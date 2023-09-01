import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/TextField',
  component: ComponentEditForm,
  parameters: {},
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'textfield',
      key: 'textfield',
      label: 'A text field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: 'terminal',
      schema: {placeholder: ''},
      weight: 0,
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const PreviewInitialValues: Story = {
  name: 'defaultValue in preview',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await step('Render single defaultValue in preview', async () => {
      const defaultValue = canvas.getByLabelText('Default Value');
      await userEvent.type(defaultValue, 'Show me in preview!');

      const previewInput = preview.getByRole('textbox');
      expect(previewInput).toHaveDisplayValue('Show me in preview!');
    });
  },
};
