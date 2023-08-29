import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import Suffix from './suffix';

export default {
  title: 'Formio/Builder/Suffix',
  component: Suffix,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {initialValues: {suffix: ''}},
  },
} as Meta<typeof Suffix>;

type Story = StoryObj<typeof Suffix>;

export const Default: Story = {
  args: {},
};
