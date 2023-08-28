import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
import {within} from '@storybook/testing-library';

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

export const Required = {
  args: {
    required: true,
    label: 'A required number field',
  },
};

export const WithoutLabel = {
  args: {
    label: '',
  },
};

export const WithToolTip = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
    required: false,
  },
};

export const WithErrors = {
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
