import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Label from './label';

export default {
  title: 'Formio/Builder/Label',
  component: Label,
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
    formik: {initialValues: {label: ''}},
  },
} as Meta<typeof Label>;

export const Default: StoryObj<typeof Label> = {
  render: () => <Label />,
  args: {},
};
