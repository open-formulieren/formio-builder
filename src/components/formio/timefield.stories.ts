import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import TimeField from './timefield';

export default {
  title: 'Formio/Components/TimeField',
  component: TimeField,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-timefield': '12:00'}},
  },
  args: {
    name: 'my-timefield',
  },
} as Meta<typeof TimeField>;

type Story = StoryObj<typeof TimeField>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required timefield',
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

export const Multiple: Story = {
  args: {
    label: 'Multiple inputs',
    description: 'Array of times instead of a single time value',
    multiple: true,
  },

  parameters: {
    formik: {
      initialValues: {'my-timefield': ['12:00']},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-my-timefield[0]');
    await expect(input1).toHaveDisplayValue('12:00');

    await userEvent.clear(input1);
    await expect(input1).toHaveDisplayValue('');

    // the label & description should be rendered only once, even with > 1 inputs
    await expect(canvas.queryAllByText('Multiple inputs')).toHaveLength(1);
    await expect(
      canvas.queryAllByText('Array of times instead of a single time value')
    ).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-my-timefield[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-my-timefield[1]')).not.toBeInTheDocument();
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-timefield': ''},
      initialErrors: {'my-timefield': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
