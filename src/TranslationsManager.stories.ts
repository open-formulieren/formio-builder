import {Meta, StoryObj} from '@storybook/react';

import TranslationsManager from './TranslationsManager';

export default {
  title: 'Client translations',
  component: TranslationsManager,
  parameters: {
    modal: {
      noModal: true,
    },
  },
} satisfies Meta<typeof TranslationsManager>;

type Story = StoryObj<typeof TranslationsManager>;

export const Default: Story = {
  name: 'Client translations',
};
