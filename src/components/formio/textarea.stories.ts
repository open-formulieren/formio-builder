import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import TextArea from './textarea';

export default {
  title: 'Formio/Components/TextArea',
  component: TextArea,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-textarea': 'initial value'}},
  },
  args: {
    name: 'my-textarea',
  },
} as Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required textarea',
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
    description: 'Array of strings instead of a single string value',
    multiple: true,
  },

  parameters: {
    formik: {
      initialValues: {'my-textarea': ['first value']},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId('input-my-textarea[0]');
    await expect(input1).toHaveDisplayValue('first value');
    await userEvent.clear(input1);
    await userEvent.type(input1, 'Foo');
    await expect(input1).toHaveDisplayValue('Foo');

    const input2 = canvas.getByTestId('input-my-textarea[1]');
    await expect(input2).toHaveDisplayValue('');

    // the label & description should be rendered only once, even with > 1 inputs
    await expect(canvas.queryAllByText('Multiple inputs')).toHaveLength(1);
    await expect(
      canvas.queryAllByText('Array of strings instead of a single string value')
    ).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-my-textarea[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-my-textarea[1]')).not.toBeInTheDocument();
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-textarea': ''},
      initialErrors: {'my-textarea': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
