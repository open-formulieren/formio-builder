import {Meta, StoryObj} from '@storybook/react-webpack5';
import {fn} from 'storybook/test';

import ModeToggle from './ModeToggle';

export default {
  title: 'Generic/ModeToggle',
  component: ModeToggle,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    name: 'story',
    modes: [
      {value: 'mode1', label: 'Mode 1'},
      {value: 'mode2', label: 'Mode 2'},
    ],
    currentMode: 'mode2',
    onToggle: fn(),
  },
} satisfies Meta<typeof ModeToggle>;

type Story = StoryObj<typeof ModeToggle>;

export const Default: Story = {};
