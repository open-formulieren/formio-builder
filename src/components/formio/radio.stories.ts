import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {within} from '@storybook/testing-library';

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
