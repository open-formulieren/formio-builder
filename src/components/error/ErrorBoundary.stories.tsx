import {Meta, StoryObj} from '@storybook/react';

import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({error}: {error: Error}) => {
  throw error;
};

const render = () => {
  const error = new Error('some error');
  return (
    <ErrorBoundary>
      <ThrowError error={error} />
    </ErrorBoundary>
  );
};

export default {
  title: 'Generic/Error boundary',
  render,
  component: ErrorBoundary,
  parameters: {
    modal: {noModal: true},
  },
} as Meta<typeof ErrorBoundary>;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};
