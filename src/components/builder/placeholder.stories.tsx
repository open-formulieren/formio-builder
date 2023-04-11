import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Placeholder from './placeholder';

export default {
  title: 'Formio/Builder/Placeholder',
  component: Placeholder,
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
    formik: {initialValues: {placeholder: ''}},
  },
} as ComponentMeta<typeof Placeholder>;

export const Default: ComponentStory<typeof Placeholder> = () => <Placeholder />;
Default.args = {};
