import {Meta, StoryObj} from '@storybook/react-webpack5';

import {withFormik} from '@/sb-decorators';

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
