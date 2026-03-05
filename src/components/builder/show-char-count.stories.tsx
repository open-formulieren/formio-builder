import {Meta, StoryObj} from '@storybook/react-vite';

import {withFormik} from '@/sb-decorators';

import ShowCharCount from './show-char-count';

export default {
  title: 'Formio/Builder/ShowCharCount',
  component: ShowCharCount,
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
    formik: {initialValues: {showCharCount: false}},
  },
} as Meta<typeof ShowCharCount>;

export const Default: StoryObj<typeof ShowCharCount> = {
  render: () => <ShowCharCount />,
  args: {},
};
