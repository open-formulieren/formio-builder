import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import DateTimeField from './datetimefield';

export default {
  title: 'Formio/Components/DateTimeField',
  component: DateTimeField,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-datetimefield': '1980-01-01T12:00'}},
  },
  args: {
    name: 'my-datetimefield',
  },
} as Meta<typeof DateTimeField>;

type Story = StoryObj<typeof DateTimeField>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required datetimefield',
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
    description: 'Array of dates instead of a single date value',
    multiple: true,
  },

  parameters: {
    formik: {
      initialValues: {'my-datetimefield': ['1980-01-01T12:00']},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-my-datetimefield[0]');
    await expect(input1).toHaveDisplayValue('1980-01-01T12:00');

    await userEvent.clear(input1);
    await expect(input1).toHaveDisplayValue('');

    // the label & description should be rendered only once, even with > 1 inputs
    await expect(canvas.queryAllByText('Multiple inputs')).toHaveLength(1);
    await expect(
      canvas.queryAllByText('Array of dates instead of a single date value')
    ).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-my-datetimefield[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-my-datetimefield[1]')).not.toBeInTheDocument();
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-datetimefield': ''},
      initialErrors: {'my-datetimefield': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
