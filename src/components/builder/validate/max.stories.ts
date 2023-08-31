import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import Max from './max';

export default {
  title: 'Formio/Builder/Validation/Maximum value',
  component: Max,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
  },
} as Meta<typeof Max>;

type Story = StoryObj<typeof Max>;

export const Default: Story = {
  args: {},

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByLabelText('Maximum value')).toHaveDisplayValue('');
  },
};

export const WithInitialValue: Story = {
  parameters: {
    formik: {initialValues: {validate: {max: 100}}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByLabelText('Maximum value')).toHaveValue(100);
  },
};

export const DecimalValue: Story = {
  parameters: {
    formik: {initialValues: {validate: {max: undefined}}},
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByLabelText('Maximum value');
    expect(input).toHaveDisplayValue('');

    await userEvent.type(input, '-3.14');
    expect(input).toHaveDisplayValue('-3.14');
  },
};
