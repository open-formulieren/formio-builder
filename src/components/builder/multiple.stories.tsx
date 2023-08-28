import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Multiple from './multiple';

export default {
  title: 'Formio/Builder/Multiple',
  component: Multiple,
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
    formik: {initialValues: {multiple: false}},
  },
} as Meta<typeof Multiple>;

export const Default: StoryObj<typeof Multiple> = {
  render: () => <Multiple />,
  args: {},
};
