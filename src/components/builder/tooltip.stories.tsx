import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Tooltip from './tooltip';

export default {
  title: 'Formio/Builder/Tooltip',
  component: Tooltip,
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
    formik: {initialValues: {tooltip: ''}},
  },
} as Meta<typeof Tooltip>;

export const Default: StoryObj<typeof Tooltip> = {
  render: () => <Tooltip />,
  args: {},
};
