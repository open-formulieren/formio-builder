import {Meta, StoryFn, StoryObj} from '@storybook/react';

import Tooltip from './tooltip';

export default {
  title: 'Formio/Utils/Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>;

export const Default: StoryObj<typeof Tooltip> = {
  parameters: {
    modal: {noModal: true},
  },

  args: {
    text: 'Text inside the tooltip',
  },
};
