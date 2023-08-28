import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn, StoryObj} from '@storybook/react';

import AutoComplete from './autocomplete';

export default {
  title: 'Formio/Builder/AutoComplete',
  component: AutoComplete,
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
    formik: {initialValues: {autocomplete: ''}},
  },
} as Meta<typeof AutoComplete>;

export const Default: StoryObj<typeof AutoComplete> = {
  render: () => <AutoComplete />,
  args: {},
};
