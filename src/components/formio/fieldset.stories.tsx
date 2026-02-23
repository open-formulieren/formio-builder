import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import Fieldset from './fieldset';

export default {
  title: 'Formio/Containers/Fieldset',
  component: Fieldset,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
  },
  args: {
    type: 'textfield',
    children: '<any children />',
  },
} as Meta<typeof Fieldset>;

type Story = StoryObj<typeof Fieldset>;

export const WithoutLabel: Story = {
  args: {
    label: '',
  },
};

export const WithToolTip: Story = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
  },
};

export const WithErrors: Story = {
  parameters: {
    formik: {
      initialValues: {someField: ''},
      initialErrors: {someField: 'Some error'},
    },
  },
  args: {
    label: 'Errors must be displayed',
    children: <input type="text" />,
    field: 'someField',
  },
  argTypes: {
    children: {table: {disable: true}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Some error')).toBeInTheDocument();
  },
};
