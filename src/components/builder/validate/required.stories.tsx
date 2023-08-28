import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import Required from './required';

export default {
  title: 'Formio/Builder/Validation/Required',
  component: Required,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    formik: {initialValues: {validate: {required: false}}},
  },
} as Meta<typeof Required>;

export const Default: StoryObj<typeof Required> = {
  render: () => <Required />,
  args: {},
};
