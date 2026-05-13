import type {Meta, StoryObj} from '@storybook/react-vite';

import Index from './index';

export default {
  title: 'Generic/Content placeholder',
  component: Index,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    children: 'Content placeholder',
  },
} as Meta<typeof Index>;

type Story = StoryObj<typeof Index>;

export const Builder: Story = {
  args: {
    variant: 'builder',
  },
};

export const Designer: Story = {
  args: {
    variant: 'designer',
  },
};
