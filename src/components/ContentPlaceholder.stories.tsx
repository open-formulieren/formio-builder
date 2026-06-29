import type {Meta, StoryObj} from '@storybook/react-vite';

import ContentPlaceholder from './ContentPlaceholder';

export default {
  title: 'Generic/Content placeholder',
  component: ContentPlaceholder,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    children: 'Content placeholder',
  },
} as Meta<typeof ContentPlaceholder>;

type Story = StoryObj<typeof ContentPlaceholder>;

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
