import {Meta, StoryObj} from '@storybook/react-webpack5';

import {withFormik} from '@/sb-decorators';

import IsSensitiveData from './is-sensitive-data';

export default {
  title: 'Formio/Builder/IsSensitiveData',
  component: IsSensitiveData,
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
    formik: {initialValues: {isSensitiveData: false}},
  },
} as Meta<typeof IsSensitiveData>;

export const Default: StoryObj<typeof IsSensitiveData> = {
  render: () => <IsSensitiveData />,
  args: {},
};
