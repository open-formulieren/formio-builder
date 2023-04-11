import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import ShowCharCount from './show-char-count';

export default {
  title: 'Formio/Builder/ShowCharCount',
  component: ShowCharCount,
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
    formik: {initialValues: {showCharCount: false}},
  },
} as ComponentMeta<typeof ShowCharCount>;

export const Default: ComponentStory<typeof ShowCharCount> = () => <ShowCharCount />;
Default.args = {};
