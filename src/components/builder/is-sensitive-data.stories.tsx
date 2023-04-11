import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import IsSensitiveData from './is-sensitive-data';

export default {
  title: 'Formio/Builder/IsSensitiveData',
  component: IsSensitiveData,
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
    formik: {initialValues: {isSensitiveData: false}},
  },
} as ComponentMeta<typeof IsSensitiveData>;

export const Default: ComponentStory<typeof IsSensitiveData> = () => <IsSensitiveData />;
Default.args = {};
