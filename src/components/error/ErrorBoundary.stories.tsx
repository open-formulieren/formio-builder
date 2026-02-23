import type {Meta, StoryObj} from '@storybook/react-webpack5';

import ErrorBoundary from './ErrorBoundary';

const ThrowError: React.FC<{error: Error}> = ({error}) => {
  throw error;
};

export default {
  title: 'Generic/Error boundary',
  component: ErrorBoundary,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    children: <ThrowError error={new Error('some error')} />,
  },
} as Meta<typeof ErrorBoundary>;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};
