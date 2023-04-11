import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Label from './label';

export default {
  title: 'Formio/Builder/Label',
  component: Label,
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
    formik: {initialValues: {label: ''}},
  },
} as ComponentMeta<typeof Label>;

export const Default: ComponentStory<typeof Label> = () => <Label />;
Default.args = {};
