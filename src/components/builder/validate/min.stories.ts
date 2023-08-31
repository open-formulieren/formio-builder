import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import Min from './min';

export default {
  title: 'Formio/Builder/Validation/Minimum value',
  component: Min,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
  },
} as Meta<typeof Min>;

type Story = StoryObj<typeof Min>;

export const Default: Story = {
  args: {},

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByLabelText('Minimum value')).toHaveDisplayValue('');
  },
};

export const WithInitialValue: Story = {
  parameters: {
    formik: {initialValues: {validate: {min: 100}}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByLabelText('Minimum value')).toHaveValue(100);
  },
};

export const DecimalValue: Story = {
  parameters: {
    formik: {initialValues: {validate: {min: undefined}}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByLabelText('Minimum value');
    expect(input).toHaveDisplayValue('');

    await userEvent.type(input, '-3.14');
    expect(input).toHaveDisplayValue('-3.14');
  },
};
