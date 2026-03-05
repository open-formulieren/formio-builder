import {Meta, StoryObj} from '@storybook/react-vite';

import Loader from '@/components/builder/loader';

type Story = StoryObj<typeof Loader>;

export default {
  title: 'Formio/Builder/Loader',
  component: Loader,
  parameters: {
    modal: {noModal: true},
  },
} satisfies Meta<typeof Loader>;

export const Default: Story = {};
