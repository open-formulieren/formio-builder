import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

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
} as ComponentMeta<typeof ClearOnHide>;

export const Default: ComponentStory<typeof ClearOnHide> = () => <ClearOnHide />;
Default.args = {};
