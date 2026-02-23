import {Meta, StoryObj} from '@storybook/react-webpack5';

import {withFormik} from '@/sb-decorators';

import RegexValidation from './regex';

export default {
  title: 'Formio/Builder/Validation/RegexValidation',
  component: RegexValidation,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 100,
    },
    modal: {noModal: true},
    formik: {
      initialValues: {validate: {pattern: ''}},
    },
  },
} as Meta<typeof RegexValidation>;

type Story = StoryObj<typeof RegexValidation>;

export const Default: Story = {};
