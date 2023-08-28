import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Placeholder from './placeholder';

export default {
  title: 'Formio/Builder/Placeholder',
  component: Placeholder,
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
    formik: {initialValues: {placeholder: ''}},
  },
} as Meta<typeof Placeholder>;

export const Default: StoryObj<typeof Placeholder> = {
  render: () => <Placeholder />,
  args: {},
};
