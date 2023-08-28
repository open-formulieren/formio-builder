import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Description from './description';

export default {
  title: 'Formio/Builder/Description',
  component: Description,
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
    formik: {initialValues: {description: ''}},
  },
} as Meta<typeof Description>;

export const Default: StoryObj<typeof Description> = {
  render: () => <Description />,
  args: {},
};
