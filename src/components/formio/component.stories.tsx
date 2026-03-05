import {Meta, StoryFn, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import Component from './component';

export default {
  title: 'Formio/Containers/Component',
  component: Component,
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
} as Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

const Template: StoryFn<typeof Component> = args => (
  <Component {...args}>
    <div>{args.children || '<any children />'}</div>
  </Component>
);

export const Required: Story = {
  render: Template,

  args: {
    required: true,
    label: 'Field label',
  },
};

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
    required: false,
  },
};

export const WithHtmlId: Story = {
  render: Template,

  args: {
    label: 'Clicking label focuses field',
    htmlId: 'with-html-id',
    children: <input id="with-html-id" type="text" defaultValue="" placeholder="I get focused" />,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const labelText = 'Clicking label focuses field';

    await expect(canvas.getByLabelText(labelText)).not.toHaveFocus();
    await userEvent.click(canvas.getByText(labelText));
    await expect(canvas.getByLabelText(labelText)).toHaveFocus();
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
  type: undefined,
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
