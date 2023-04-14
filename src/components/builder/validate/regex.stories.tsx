import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import RegexValidation from './regex';

export default {
  title: 'Formio/Builder/Validation/RegexValidation',
  component: RegexValidation,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 100,
    },
    modal: {noModal: true},
    formik: {
      initialValues: {validate: {pattern: ''}},
    },
  },
} as ComponentMeta<typeof RegexValidation>;

const Template: ComponentStory<typeof RegexValidation> = args => <RegexValidation {...args} />;

export const Default = Template.bind({});
