import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import Number from './number';

export default {
  title: 'Formio/Components/Number',
  component: Number,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-number': ''}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-number',
  },
} as Meta<typeof Number>;

type Story = StoryObj<typeof Number>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required number field',
  },
};

export const WithoutLabel: Story = {
  args: {
    label: '',
  },
};

export const WithToolTip: Story = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
    required: false,
  },
};

export const WithPrefix: Story = {
  args: {
    label: 'With prefix',
    prefix: 'm<sup>3</sup>',
  },
};

export const WithSuffix: Story = {
  args: {
    label: 'With suffix',
    suffix: 'm<sup>3</sup>',
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-number': ''},
      initialErrors: {'my-number': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
