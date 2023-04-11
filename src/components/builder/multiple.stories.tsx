import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Multiple from './multiple';

export default {
  title: 'Formio/Builder/Multiple',
  component: Multiple,
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
    formik: {initialValues: {multiple: false}},
  },
} as ComponentMeta<typeof Multiple>;

export const Default: ComponentStory<typeof Multiple> = () => <Multiple />;
Default.args = {};
