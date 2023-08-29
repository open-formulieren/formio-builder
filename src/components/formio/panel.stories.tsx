import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
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
} as Meta<typeof Panel>;

interface StoryArgs extends PanelProps {
  nestedContent: string;
}

const Template: StoryFn<React.FC<StoryArgs>> = args => (
  <Panel {...args}>{args.nestedContent}</Panel>
);

export const Default = {
  render: Template,
};

export const WithTooltip = {
  render: Template,

  args: {
    tooltip: 'I am a tooltip!',
  },
};

export const Collapsible = {
  render: Template,

  args: {
    collapsible: true,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(args.nestedContent)).toBeInTheDocument();

    const header = await canvas.findByText(args.title as string);
    await userEvent.click(header);
    await expect(canvas.queryByText(args.nestedContent)).not.toBeInTheDocument();
  },
};

export const CollapsibleInitiallyCollapsed = {
  render: Template,

  args: {
    collapsible: true,
    initialCollapsed: true,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(args.nestedContent)).not.toBeInTheDocument();

    const header = await canvas.findByText(args.title as string);
    await userEvent.click(header);
    await expect(canvas.queryByText(args.nestedContent)).toBeInTheDocument();
  },
};
