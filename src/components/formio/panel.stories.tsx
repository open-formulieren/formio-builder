import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, userEvent, within} from 'storybook/test';

import Panel from './panel';

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
    children: 'Panel body',
  },
} satisfies Meta<typeof Panel>;

type Story = StoryObj<typeof Panel>;

export const Default: Story = {};

export const WithTooltip: Story = {
  args: {
    tooltip: 'I am a tooltip!',
  },
};

export const Collapsible: Story = {
  args: {
    collapsible: true,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(args.children as string)).toBeInTheDocument();

    const header = await canvas.findByText(args.title as string);
    await userEvent.click(header);
    await expect(canvas.queryByText(args.children as string)).not.toBeInTheDocument();
  },
};

export const CollapsibleInitiallyCollapsed: Story = {
  args: {
    collapsible: true,
    initialCollapsed: true,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(args.children as string)).not.toBeInTheDocument();

    const header = await canvas.findByText(args.title as string);
    await userEvent.click(header);
    await expect(canvas.queryByText(args.children as string)).toBeInTheDocument();
  },
};

export const CollapsibleWithExtraHeaderControls: Story = {
  args: {
    collapsible: true,
    headerEnd: <button onClick={() => fn()}>Extra button</button>,
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByText(args.title as string);
    const headerControls = canvas.getByRole('button', {name: 'Extra button'});

    await expect(canvas.queryByText(args.children as string)).toBeVisible();
    await expect(headerControls).toBeVisible();

    await userEvent.click(header);
    await expect(canvas.queryByText(args.children as string)).not.toBeInTheDocument();
    await expect(headerControls).toBeVisible();
  },
};
