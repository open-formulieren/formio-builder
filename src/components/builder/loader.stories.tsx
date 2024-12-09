import {Meta, StoryObj} from '@storybook/react';

import Loader from '@/components/builder/loader';

export default {
  title: 'Formio/Builder/Loader',
  component: Loader,
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
  },
} as Meta<typeof Loader>;

export const Default: StoryObj<typeof Loader> = {
  render: () => <Loader />,
  args: {},
};
