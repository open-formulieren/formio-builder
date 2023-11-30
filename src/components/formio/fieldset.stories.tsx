import {expect} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import Fieldset from './fieldset';

export default {
  title: 'Formio/Containers/Fieldset',
  component: Fieldset,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
    docs: {
      inlineStories: false,
      iframeHeight: 150,
    },
  },
  args: {
    type: 'textfield',
  },
} as Meta<typeof Fieldset>;

type Story = StoryObj<typeof Fieldset>;

const Template: StoryFn<typeof Fieldset> = args => (
  <Fieldset {...args}>
    <div>{args.children || '<any children />'}</div>
  </Fieldset>
);

export const WithoutLabel: Story = {
  render: Template,

  args: {
    label: '',
  },
};

export const WithToolTip: Story = {
  render: Template,

  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
  },
};

export const WithErrors: Story = Template.bind([]);
WithErrors.parameters = {
  formik: {
    initialValues: {someField: ''},
    initialErrors: {someField: 'Some error'},
  },
};
WithErrors.args = {
  label: 'Errors must be displayed',
  children: <input type="text" />,
  field: 'someField',
};
WithErrors.argTypes = {
  children: {table: {disable: true}},
};
WithErrors.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Some error')).toBeInTheDocument();
};
