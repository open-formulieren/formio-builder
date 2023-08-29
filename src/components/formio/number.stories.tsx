import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import Number from './number';

export default {
  title: 'Formio/Components/Number',
  component: Number,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-number': ''}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-number',
  },
} as Meta<typeof Number>;

type Story = StoryObj<typeof Number>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required number field',
  },
};

export const WithoutLabel: Story = {
  args: {
    label: '',
  },
};

export const WithToolTip: Story = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
    required: false,
  },
};

export const WithSuffix: Story = {
  args: {
    label: 'With suffix',
    suffix: 'm<sup>3</sup>',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Multiple inputs',
    description: 'Array of numbers instead of a single number value',
    multiple: true,
  },

  parameters: {
    formik: {
      initialValues: {'my-number': [42]},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId('input-my-number[0]');
    await expect(input1).toHaveDisplayValue('42');
    await userEvent.clear(input1);
    await userEvent.type(input1, '314');
    await expect(input1).toHaveDisplayValue('314');

    const input2 = canvas.getByTestId('input-my-number[1]');
    await expect(input2).toHaveDisplayValue('');

    // the label & description should be rendered only once, even with > 1 inputs
    await expect(canvas.queryAllByText('Multiple inputs')).toHaveLength(1);
    await expect(
      canvas.queryAllByText('Array of numbers instead of a single number value')
    ).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-my-number[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-my-number[1]')).not.toBeInTheDocument();
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-number': ''},
      initialErrors: {'my-number': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
