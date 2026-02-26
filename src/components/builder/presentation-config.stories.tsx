import {Meta} from '@storybook/react-vite';

import {withFormik} from '@/sb-decorators';

import PresentationConfig from './presentation-config';

export default {
  title: 'Formio/Builder/PresentationConfig',
  component: PresentationConfig,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      inlineStories: false, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      iframeHeight: 260,
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    formik: {
      initialValues: {
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
      },
    },
  },
  args: {
    exposeShowInSummary: true,
    exposeShowInEmail: true,
    exposeShowInPDF: true,
  },
} as Meta<typeof PresentationConfig>;

export const AllOptionsExposed = {};

export const SubsetOptionsExposed = {
  args: {
    exposeShowInSummary: false,
  },
};
