import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
import {within} from '@storybook/testing-library';

import ComponentLabel from './component-label';

export default {
  title: 'Formio/Utils/ComponentLabel',
  component: ComponentLabel,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    required: false,
    label: 'Example label text',
    tooltip: '',
    htmlId: '',
  },
} as Meta<typeof ComponentLabel>;

export const Default = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Example label text')).toBeInTheDocument();
  },
};

export const WithTooltip = {
  args: {
    tooltip: 'Call me clippy',
  },
};

export const Required = {
  args: {
    required: true,
  },
};
