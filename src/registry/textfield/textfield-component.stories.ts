import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

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
    const editForm = within(canvas.getByTestId('componentEditForm'));
    const preview = within(canvas.getByTestId('componentPreview'));

    await step('Render single defaultValue in preview', async () => {
      const defaultValue = canvas.getByLabelText('Default Value');
      await userEvent.type(defaultValue, 'Show me in preview!');

      const previewInput = preview.getByRole('textbox');
      await waitFor(() => {
        expect(previewInput).toHaveDisplayValue('Show me in preview!');
      });
    });

    await step('Toggle to multi=true', async () => {
      fireEvent.click(canvas.getByLabelText('Multiple values'));
      // the single defaultValue should become the first element in the multiple array
      await editForm.findByDisplayValue('Show me in preview!');
    });

    await step('Add a second item to default value', async () => {
      const addButton = editForm.getByRole('button', {name: 'Add another'});
      await userEvent.click(addButton);
      await userEvent.type(editForm.getByTestId('input-defaultValue[1]'), 'Second item');
      await editForm.findByDisplayValue('Second item');
    });

    await step('Toggle back to multi=false', async () => {
      fireEvent.click(canvas.getByLabelText('Multiple values'));
      // the single defaultValue should become the first element in the multiple array
      await editForm.findByDisplayValue('Show me in preview!');
      expect(editForm.queryByDisplayValue('Second item')).not.toBeInTheDocument();

      await preview.findByDisplayValue('Show me in preview!');
      expect(preview.queryByDisplayValue('Second item')).not.toBeInTheDocument();
    });
  },
};
