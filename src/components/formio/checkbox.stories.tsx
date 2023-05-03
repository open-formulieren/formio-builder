import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {within} from '@storybook/testing-library';

import Checkbox from './checkbox';

export default {
  title: 'Formio/Components/Checkbox',
  component: Checkbox,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-checkbox': false}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-checkbox',
    label: '',
    tooltip: '',
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = args => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Labeled checkbox',
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  label: 'With tooltip',
  tooltip: 'Hiya!',
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  label: 'With errors',
};
WithErrors.parameters = {
  formik: {
    initialValues: {'my-checkbox': false},
    initialErrors: {'my-checkbox': 'Example error', 'other-field': 'Other error'},
  },
};
WithErrors.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
  await expect(canvas.queryByText('Example error')).toBeInTheDocument();
};
