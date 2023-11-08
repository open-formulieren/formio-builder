import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import Checkbox from './checkbox';

export default {
  title: 'Formio/Components/Checkbox',
  component: Checkbox,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-checkbox': false}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-checkbox',
    label: '',
    tooltip: '',
  },
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Labeled checkbox',
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
      initialValues: {'my-checkbox': false},
      initialErrors: {'my-checkbox': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
