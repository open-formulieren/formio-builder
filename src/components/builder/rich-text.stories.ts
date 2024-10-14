import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import RichText from './rich-text';

export default {
  title: 'Formio/Builder/RichText',
  component: RichText,
  decorators: [withFormik],
  args: {
    name: 'richText',
    required: false,
    supportsBackendTemplating: false,
  },
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {initialValues: {richText: ''}},
  },
} satisfies Meta<typeof RichText>;

type Story = StoryObj<typeof RichText>;

export const Default: Story = {};

export const WithBackendTemplatingSupport: Story = {
  args: {
    supportsBackendTemplating: true,
  },
};
