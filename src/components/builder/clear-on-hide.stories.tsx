import {Meta, StoryObj} from '@storybook/react-webpack5';

import {withFormik} from '@/sb-decorators';

import ClearOnHide from './clear-on-hide';

export default {
  title: 'Formio/Builder/ClearOnHide',
  component: ClearOnHide,
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
    formik: {initialValues: {clearOnHide: false}},
  },
} as Meta<typeof ClearOnHide>;

export const Default: StoryObj<typeof ClearOnHide> = {
  render: () => <ClearOnHide />,
  args: {},
};
