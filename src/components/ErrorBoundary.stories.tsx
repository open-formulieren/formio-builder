import {Meta, StoryObj} from '@storybook/react';

import ErrorBoundary from '@/components/ErrorBoundary';

const Nested = ({error}: {error: Error}) => {
  throw error;
};

const render = () => {
  const error = new Error('some error');
  return (
    <ErrorBoundary>
      <Nested error={error} />
    </ErrorBoundary>
  );
};

export default {
  title: 'Generic/ErrorBoundary',
  render,
  component: ErrorBoundary,
  parameters: {
    modal: {noModal: true},
  },
  args: {},
} as Meta<typeof ErrorBoundary>;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};
