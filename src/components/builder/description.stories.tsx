import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Description from './description';

export default {
  title: 'Formio/Builder/Description',
  component: Description,
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
    formik: {initialValues: {description: ''}},
  },
} as ComponentMeta<typeof Description>;

export const Default: ComponentStory<typeof Description> = () => <Description />;
Default.args = {};
