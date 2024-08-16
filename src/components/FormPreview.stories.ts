import {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, waitFor, within} from '@storybook/test';

import {BuilderContextDecorator} from '@/sb-decorators';

import FormPreview from './FormPreview';

export default {
  title: 'Public API/FormPreview (⚠️ UNSTABLE)',
  component: FormPreview,
  decorators: [BuilderContextDecorator],
  parameters: {
    modal: {noModal: true},
  },
} satisfies Meta<typeof FormPreview>;

type Story = StoryObj<typeof FormPreview>;

export const SingleTextField: Story = {
  name: 'Form with text field',
  args: {
    components: [
      {
        id: 'oiejwa',
        type: 'textfield',
        key: 'parent.aTextField',
        label: 'A text field',
        defaultValue: 'a default value',
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Edit'}));
    await waitFor(async () => {
      expect(await canvas.findByRole('dialog')).toBeVisible();
    });
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
          {
            id: 'vrekjc',
            type: 'textfield',
            key: 'nestedTextfield2',
            label: 'Nested textfield 2',
          },
        ],
      },
      {
        id: 'cols1',
        type: 'columns',
        key: 'cols1',
        columns: [
          {
            size: 6,
            sizeMobile: 4,
            components: [
              {
                id: 'number1',
                type: 'number',
                key: 'number1',
                label: 'Number',
              },
            ],
          },
          {
            size: 3,
            sizeMobile: 4,
            components: [
              {
                id: 'email1',
                type: 'email',
                key: 'email1',
                label: 'Email 1',
                validateOn: 'blur',
              },
              {
                id: 'email2',
                type: 'email',
                key: 'email2',
                label: 'Email 2',
                validateOn: 'blur',
              },
            ],
          },
          {
            size: 3,
            sizeMobile: 4,
            components: [
              {
                id: 'content1',
                type: 'content',
                key: 'content1',
                html: '<p>Some free form content</p>',
              },
            ],
          },
        ],
      },
      {
        id: 'editgrid1',
        type: 'editgrid',
        key: 'editgrid1',
        label: 'Contacts',
        groupLabel: 'Person',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'editgridNested1',
            type: 'textfield',
            key: 'editgridNested1',
            label: 'Name',
          },
          {
            id: 'editgridNested2',
            type: 'phoneNumber',
            key: 'editgridNested2',
            label: 'Phone number',
            inputMask: null,
          },
        ],
      },
    ],
  },
};
