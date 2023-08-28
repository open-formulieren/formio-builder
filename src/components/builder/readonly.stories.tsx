import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import ReadOnly from './readonly';

export default {
  title: 'Formio/Builder/ReadOnly',
  component: ReadOnly,
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
    formik: {initialValues: {disabled: false}},
  },
} as Meta<typeof ReadOnly>;

export const Default: StoryObj<typeof ReadOnly> = {
  render: () => <ReadOnly />,
  args: {},
};
