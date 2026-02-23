import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, within} from 'storybook/test';

import ComponentLabel from './component-label';

export default {
  title: 'Formio/Utils/ComponentLabel',
  component: ComponentLabel,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    required: false,
    label: 'Example label text',
    tooltip: '',
    htmlId: '',
  },
} satisfies Meta<typeof ComponentLabel>;

type Story = StoryObj<typeof ComponentLabel>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Example label text')).toBeInTheDocument();
  },
};

export const WithTooltip: Story = {
  args: {
    tooltip: 'Call me clippy',
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};
