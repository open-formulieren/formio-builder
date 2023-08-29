import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {waitFor, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import MaxLength from './maxlength';

export default {
  title: 'Formio/Builder/Validation/MaxLength',
  component: MaxLength,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 100,
    },
    modal: {noModal: true},
    formik: {initialValues: {validate: {maxLength: 1000}}},
  },
} as Meta<typeof MaxLength>;

type Story = StoryObj<typeof MaxLength>;

export const Default: Story = {
  args: {},

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Maximum length')).toHaveValue(1000);
    });
  },
};

export const WithInitialValue: Story = {
  parameters: {
    formik: {initialValues: {validate: {maxLength: 100}}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Maximum length')).toHaveValue(100);
    });
  },
};
