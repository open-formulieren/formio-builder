import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Required from './required';

export default {
  title: 'Formio/Builder/Validation/Required',
  component: Required,
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
    formik: {initialValues: {validate: {required: false}}},
  },
} as ComponentMeta<typeof Required>;

export const Default: ComponentStory<typeof Required> = () => <Required />;
Default.args = {};
