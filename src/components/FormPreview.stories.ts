import {Meta, StoryObj} from '@storybook/react';

import FormPreview from './FormPreview';

export default {
  title: 'Public API/FormPreview',
  component: FormPreview,
  parameters: {
    modal: {noModal: true},
  },
} as Meta<typeof FormPreview>;

type Story = StoryObj<typeof FormPreview>;

export const SingleTextField: Story = {
  name: 'Form with text field',
  args: {
    components: [
      {
        id: 'oiejwa',
        type: 'textfield',
        key: 'aTextField',
        label: 'A text field',
      },
    ],
  },
};

export const FieldSet: Story = {
  name: 'Form with fieldset',
  args: {
    components: [
      {
        id: 'oiejwa',
        type: 'textfield',
        key: 'aTextField',
        label: 'A text field',
      },
      {
        id: 'wieurq4',
        type: 'fieldset',
        key: 'aFieldset',
        label: 'Fieldset with nested components',
        hideHeader: false,
        components: [
          {
            id: 'vr832jc',
            type: 'textfield',
            key: 'nestedTextfield',
            label: 'Nested textfield',
          },
        ],
      },
    ],
  },
};
