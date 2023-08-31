import {Meta, StoryObj} from '@storybook/react';

import Affix from './affix';

export default {
  title: 'Formio/Utils/Affix',
  component: Affix,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    children: 'm<sup>3</sup><sub>kg</sub>',
  },
} as Meta<typeof Affix>;

type Story = StoryObj<typeof Affix>;

export const Default: Story = {};

export const UnsupportedHTMLEscaped: Story = {
  args: {
    children: '<strong>no strong rendered</strong>',
  },
};
