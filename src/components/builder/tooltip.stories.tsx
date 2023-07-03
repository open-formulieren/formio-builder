import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Tooltip from './tooltip';

export default {
  title: 'Formio/Builder/Tooltip',
  component: Tooltip,
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
    formik: {initialValues: {tooltip: ''}},
  },
} as ComponentMeta<typeof Tooltip>;

export const Default: ComponentStory<typeof Tooltip> = () => <Tooltip />;
Default.args = {};
