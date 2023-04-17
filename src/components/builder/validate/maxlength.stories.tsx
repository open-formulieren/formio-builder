import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {waitFor, within} from '@storybook/testing-library';

import MaxLength from './maxlength';

export default {
  title: 'Formio/Builder/Validation/MaxLength',
  component: MaxLength,
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
    formik: {initialValues: {validate: {maxLength: 1000}}},
  },
} as ComponentMeta<typeof MaxLength>;

const Template: ComponentStory<typeof MaxLength> = args => <MaxLength {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await waitFor(async () => {
    await expect(canvas.getByLabelText('Maximum length')).toHaveValue(1000);
  });
};

export const WithInitialValue = Template.bind({});
WithInitialValue.parameters = {
  formik: {initialValues: {validate: {maxLength: 100}}},
};
WithInitialValue.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await waitFor(async () => {
    await expect(canvas.getByLabelText('Maximum length')).toHaveValue(100);
  });
};
