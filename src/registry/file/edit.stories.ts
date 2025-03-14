import {Meta, StoryObj} from '@storybook/react';
import {expect, fireEvent, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/File upload',
  component: ComponentEditForm,
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
      // @ts-expect-error this is what is actually produced by Formio
      defaultValue: null,
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),

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

export const SoftRequiredValidation: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Navigate to validate tab', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Validation'}));
    });

    // establish base state
    const hardRequired = await canvas.findByRole('checkbox', {name: 'Required'});
    expect(hardRequired).not.toBeChecked();
    const softRequired = await canvas.findByRole('checkbox', {name: 'Soft required'});
    expect(softRequired).not.toBeChecked();

    await step('Mark component soft required', async () => {
      // We use fireEvent because firefox borks on userEvent.click, see:
      // https://github.com/testing-library/user-event/issues/1149
      fireEvent.click(softRequired);
      expect(softRequired).toBeChecked();
      expect(hardRequired).not.toBeChecked();
    });

    await step('Mark component hard required', async () => {
      // We use fireEvent because firefox borks on userEvent.click, see:
      // https://github.com/testing-library/user-event/issues/1149
      fireEvent.click(hardRequired);
      await waitFor(() => {
        expect(hardRequired).toBeChecked();
        expect(softRequired).not.toBeChecked();
        expect(softRequired).toBeDisabled();
      });
    });

    await step('Mark component not hard required', async () => {
      // We use fireEvent because firefox borks on userEvent.click, see:
      // https://github.com/testing-library/user-event/issues/1149
      fireEvent.click(hardRequired);
      await waitFor(() => {
        expect(hardRequired).not.toBeChecked();
        expect(softRequired).not.toBeChecked();
        expect(softRequired).not.toBeDisabled();
      });
    });
  },
};
