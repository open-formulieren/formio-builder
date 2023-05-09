import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
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
} as ComponentMeta<typeof ComponentLabel>;

const Template: ComponentStory<typeof ComponentLabel> = args => <ComponentLabel {...args} />;

export const Default = Template.bind({});
Default.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Example label text')).toBeInTheDocument();
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  tooltip: 'Call me clippy',
};

export const Required = Template.bind({});
Required.args = {
  required: true,
};
