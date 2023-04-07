import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import Component from './component';

export default {
  title: 'Formio/Component (wrapper)',
  component: Component,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    type: 'textfield',
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = args => (
  <Component {...args}>
    <div>{args.children || '<any children />'}</div>
  </Component>
);

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: 'Field label',
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

export const WithHtmlId = Template.bind({});
WithHtmlId.args = {
  label: 'Clicking label focuses field',
  htmlId: 'with-html-id',
  children: <input id="with-html-id" type="text" defaultValue="" placeholder="I get focused" />,
};
WithHtmlId.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const labelText = 'Clicking label focuses field';

  await expect(canvas.getByLabelText(labelText)).not.toHaveFocus();
  await userEvent.click(canvas.getByText(labelText));
  await expect(canvas.getByLabelText(labelText)).toHaveFocus();
};
