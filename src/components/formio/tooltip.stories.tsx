import {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import Tooltip from './tooltip';

export default {
  title: 'Formio/Utils/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  parameters: {
    modal: {noModal: true},
  },

  args: {
    text: 'Text inside the tooltip',
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard('[Tab]');
    expect(await canvas.findByText('Text inside the tooltip')).toBeVisible();
  },
};
