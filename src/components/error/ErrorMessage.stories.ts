import {Meta, StoryObj} from '@storybook/react';

import ErrorMessage, {ALERT_MODIFIERS} from './ErrorMessage';

export default {
  title: 'Generic/Error Message',
  component: ErrorMessage,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    children: 'Dummy message',
  },
  argTypes: {
    level: {
      options: ALERT_MODIFIERS,
      control: {
        type: 'radio',
      },
    },
    children: {control: false},
  },
} satisfies Meta<typeof ErrorMessage>;

type Story = StoryObj<typeof ErrorMessage>;

export const Error: Story = {
  name: 'Error Message',
  args: {
    level: 'error',
    children: 'Sadness, something went wrong.',
  },
};

export const Ok: Story = {
  name: 'Ok Message',
  args: {
    level: 'ok',
    children: 'Something went OK.',
  },
};

export const Info: Story = {
  name: 'Info Message',
  args: {
    level: 'info',
    children: 'This is an info!',
  },
};

export const Warning: Story = {
  name: 'Warning Message',
  args: {
    level: 'warning',
    children: 'You are being warned.',
  },
};
