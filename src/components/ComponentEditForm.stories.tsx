import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {expect, fireEvent, fn, userEvent, within} from '@storybook/test';

import ComponentEditForm from './ComponentEditForm';

export default {
  title: 'Edit form/Component edit form',
  component: ComponentEditForm,
  args: {
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

const render: StoryFn<typeof ComponentEditForm> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}) => (
  <ComponentEditForm
    isNew={isNew}
    component={component}
    builderInfo={builderInfo}
    onCancel={onCancel}
    onRemove={onRemove}
    onSubmit={onSubmit}
  />
);

export const Default: Story = {
  render,

  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'textfield',
      label: 'Text field',
      key: 'textField',
    },
    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: 'terminal',
      schema: {placeholder: ''},
      weight: 0,
    },
  },
};

export const EditJSON: Story = {
  render,

  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'textfield',
      label: 'Text field',
      key: 'textField',
    },
    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: 'terminal',
      schema: {placeholder: ''},
      weight: 0,
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    let componentJSON: any;
    await step('Open JSON edit', async () => {
      // https://github.com/testing-library/user-event/issues/1149 applies to radio and
      // checkbox inputs
      fireEvent.click(canvas.getByText('Edit JSON'));
      componentJSON = JSON.parse(
        canvas.getByLabelText<HTMLTextAreaElement>('Edit component JSON').value
      );
      expect(componentJSON.label).toBe('Text field');
    });

    await step('Modify JSON to change component', async () => {
      componentJSON.label = 'Updated label';
      const editField = canvas.getByLabelText<HTMLTextAreaElement>('Edit component JSON');
      await userEvent.clear(editField);
      // { needs to be escaped: https://github.com/testing-library/user-event/issues/584
      const updatedJSON = JSON.stringify(componentJSON, null, 2).replace(/[{[]/g, '$&$&');
      await userEvent.click(editField);
      await userEvent.type(editField, updatedJSON);
    });

    await step('Check that label field is updated', async () => {
      const labelField = within(canvas.getByTestId('componentEditForm')).getByLabelText('Label');
      expect(labelField).toHaveDisplayValue('Updated label');
    });
  },
};
