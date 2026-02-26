import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import SelectBoxes from './selectboxes';

export default {
  title: 'Formio/Components/SelectBoxes',
  component: SelectBoxes,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-selectboxes': {}}},
  },
  args: {
    name: 'my-selectboxes',
    label: '',
    tooltip: '',
    options: [
      {value: 'a', label: 'A'},
      {value: 'b', label: 'B'},
    ],
  },
} as Meta<typeof SelectBoxes>;

type Story = StoryObj<typeof SelectBoxes>;

export const Default: Story = {
  args: {
    label: 'Labeled selectboxes',
  },
};

export const WithInitialChecked: Story = {
  parameters: {
    formik: {
      initialValues: {
        'my-selectboxes': {
          b: true,
        },
      },
    },
  },
  args: {
    label: 'Labeled selectboxes',
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
      {value: 'a', label: 'A', description: 'Test'},
      {value: 'b', label: 'B'},
    ],
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-selectboxes': false},
      initialErrors: {'my-selectboxes': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
