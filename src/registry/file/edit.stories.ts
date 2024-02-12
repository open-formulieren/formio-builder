import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, within} from '@storybook/testing-library';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';

export default {
  title: 'Builder components/File upload',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,

    component: {
      id: 'kiweljhr',
      storage: 'url',
      webcam: false,
      options: {
        withCredentials: true,
      },
      url: '',
      type: 'file',
      key: 'file',
      label: 'A file upload',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
      defaultValue: null,
    },

    builderInfo: {
      title: 'File upload',
      icon: '',
      group: 'file',
      weight: 10,
      schema: {},
    },
  },
} satisfies Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const ToggleToMultiple: Story = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    const multipleCheckbox = canvas.getByLabelText<HTMLInputElement>('Multiple values');
    fireEvent.click(multipleCheckbox);
    await expect(multipleCheckbox).toBeChecked();

    // Save and check that the default value was untouched
    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
    // @ts-ignore
    const {defaultValue} = args.onSubmit.mock.calls[0][0];
    expect(defaultValue).toBeNull();
  },
};
