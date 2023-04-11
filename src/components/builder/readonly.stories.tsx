import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import ReadOnly from './readonly';

export default {
  title: 'Formio/Builder/ReadOnly',
  component: ReadOnly,
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
    formik: {initialValues: {disabled: false}},
  },
} as ComponentMeta<typeof ReadOnly>;

export const Default: ComponentStory<typeof ReadOnly> = () => <ReadOnly />;
Default.args = {};
