import {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import {withFormik} from '@/sb-decorators';

import Radio from './radio';

export default {
  title: 'Formio/Components/Radio',
  component: Radio,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-radio': ''}},
  },
  args: {
    name: 'my-radio',
    label: '',
    tooltip: '',
    options: [
      {value: 'a', label: 'A'},
      {value: 'b', label: 'B'},
    ],
  },
} as Meta<typeof Radio>;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Labeled radio',
  },
};

export const WithInitialChecked: Story = {
  parameters: {
    formik: {
      initialValues: {
        'my-radio': 'b',
      },
    },
  },
  args: {
    label: 'Labeled radio',
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('A')).not.toBeChecked();
    await expect(canvas.getByLabelText('B')).toBeChecked();
  },
};

export const WithToolTip: Story = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'With description',
    description: 'A description',
    options: [
      {value: 'a', label: 'A', description: 'this is a description for label A'},
      {value: 'b', label: 'B', description: 'this is a description for label B'},
    ],
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-radio': ''},
      initialErrors: {'my-radio': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};

export const DefaultValueRemoved: Story = {
  args: {
    label: 'Clearable default value',
    isClearable: true,
    options: [
      {value: 'a', label: 'A'},
      {value: 'b', label: 'B'},
    ],
  },

  parameters: {
    formik: {
      initialValues: {'my-radio': 'a'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {name: 'Clear selection'});
    const input1 = canvas.getByLabelText('A');
    const input2 = canvas.getByLabelText('B');

    // Before clearing the default value
    expect(button).toBeVisible();
    await expect(input1).toBeChecked();
    await expect(input2).not.toBeChecked();

    // After clearing the default value
    await userEvent.click(button);
    expect(button).not.toBeVisible();
    await expect(input1).not.toBeChecked();
    await expect(input2).not.toBeChecked();
  },
};
