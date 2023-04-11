import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import Panel, {PanelProps} from './panel';

export default {
  title: 'Formio/Containers/Panel',
  component: Panel,
  parameters: {
    modal: {noModal: true},
  },
  argTypes: {
    children: {table: {disable: true}},
  },
  args: {
    title: 'Panel 🐪',
    tooltip: '',
    collapsible: false,
    initialCollapsed: false,
    nestedContent: 'Panel body',
  },
} as ComponentMeta<typeof Panel>;

interface StoryArgs extends PanelProps {
  nestedContent: string;
}

const Template: ComponentStory<React.FC<StoryArgs>> = args => (
  <Panel {...args}>{args.nestedContent}</Panel>
);

export const Default = Template.bind({});

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  tooltip: 'I am a tooltip!',
};

export const Collapsible = Template.bind({});
Collapsible.args = {
  collapsible: true,
};
Collapsible.play = async ({canvasElement, args}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText(args.nestedContent)).toBeInTheDocument();

  const header = await canvas.findByText(args.title as string);
  await userEvent.click(header);
  await expect(canvas.queryByText(args.nestedContent)).not.toBeInTheDocument();
};

export const CollapsibleInitiallyCollapsed = Template.bind({});
CollapsibleInitiallyCollapsed.args = {
  collapsible: true,
  initialCollapsed: true,
};
CollapsibleInitiallyCollapsed.play = async ({canvasElement, args}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText(args.nestedContent)).not.toBeInTheDocument();

  const header = await canvas.findByText(args.title as string);
  await userEvent.click(header);
  await expect(canvas.queryByText(args.nestedContent)).toBeInTheDocument();
};
