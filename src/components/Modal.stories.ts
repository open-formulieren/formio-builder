import {Meta, StoryObj} from '@storybook/react-webpack5';
import {fn} from 'storybook/test';

import Modal from './Modal';

export default {
  title: 'Generic/Modal',
  component: Modal,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    isOpen: true,
    closeModal: fn(),
    className: 'additional-classnames',
    children: 'Modal content',
  },
} satisfies Meta<typeof Modal>;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};
