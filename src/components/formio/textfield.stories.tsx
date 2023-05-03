import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {within} from '@storybook/testing-library';

import TextField from './textfield';

export default {
  title: 'Formio/Components/TextField',
  component: TextField,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-textfield': 'initial value'}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-textfield',
  },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = args => <TextField {...args} />;

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: 'A required textfield',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: '',
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  label: 'With tooltip',
  tooltip: 'Hiya!',
  required: false,
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  label: 'With errors',
};
WithErrors.parameters = {
  formik: {
    initialValues: {'my-textfield': ''},
    initialErrors: {'my-textfield': 'Example error', 'other-field': 'Other error'},
  },
};
WithErrors.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
  await expect(canvas.queryByText('Example error')).toBeInTheDocument();
};
