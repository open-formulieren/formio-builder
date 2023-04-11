import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import AutoComplete from './autocomplete';

export default {
  title: 'Formio/Builder/AutoComplete',
  component: AutoComplete,
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
    formik: {initialValues: {autocomplete: ''}},
  },
} as ComponentMeta<typeof AutoComplete>;

export const Default: ComponentStory<typeof AutoComplete> = () => <AutoComplete />;
Default.args = {};
