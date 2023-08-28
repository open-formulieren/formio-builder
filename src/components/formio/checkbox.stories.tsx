import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
import {within} from '@storybook/testing-library';

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

export const Default = {
  args: {
    label: 'Labeled checkbox',
  },
};

export const WithToolTip = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
  },
};

export const WithErrors = {
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
