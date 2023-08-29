import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

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
