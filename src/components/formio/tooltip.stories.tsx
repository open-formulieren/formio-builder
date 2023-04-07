import {ComponentMeta, ComponentStory} from '@storybook/react';

import Tooltip from './tooltip';

export default {
  title: 'Formio/Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

export const Default: ComponentStory<typeof Tooltip> = args => <Tooltip {...args} />;
Default.parameters = {
  modal: {noModal: true},
};
Default.args = {
  text: 'Text inside the tooltip',
};
