import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import TextField from './textfield';

export default {
  title: 'Formio/Components/TextField',
  component: TextField,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-textfield': 'initial value'}},
    docs: {inlineStories: false}, // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
  },
  args: {
    name: 'my-textfield',
  },
} as Meta<typeof TextField>;

type Story = StoryObj<typeof TextField>;

export const Required: Story = {
  args: {
    required: true,
    label: 'A required textfield',
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
      initialValues: {'my-textfield': ['first value']},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId('input-my-textfield[0]');
    await expect(input1).toHaveDisplayValue('first value');
    await userEvent.clear(input1);
    await userEvent.type(input1, 'Foo');
    await expect(input1).toHaveDisplayValue('Foo');

    const input2 = canvas.getByTestId('input-my-textfield[1]');
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
    await expect(canvas.getByTestId('input-my-textfield[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-my-textfield[1]')).not.toBeInTheDocument();
  },
};

export const WithErrors: Story = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-textfield': ''},
      initialErrors: {'my-textfield': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};

export const WithMask: Story = {
  args: {
    label: 'With mask',
    inputMask: '9999 AA',
  },

  parameters: {
    formik: {
      initialValues: {'my-textfield': ''},
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText<HTMLInputElement>('With mask');

    await step('Empty input shows placeholder', async () => {
      expect(input).toHaveDisplayValue('');
      expect(input).toHaveAttribute('placeholder', '____ __');
    });

    await step('Typing into input', async () => {
      await userEvent.type(input, '1015');
      // with formio's masking enabled, this would be '1015 __', but we're skipping
      // that messy implementation for the form builder. At some point we should be
      // able to re-use renderer components that fully implement the behaviour in an
      // accessible manner.
      expect(input).toHaveDisplayValue('1015');
    });
  },
};

export const WithCharCount: Story = {
  args: {
    label: 'With charcount',
    showCharCount: true,
  },

  parameters: {
    formik: {
      initialValues: {'my-textfield': ''},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('With charcount');
    await userEvent.type(input, 'Foo');

    expect(await canvas.findByText('3 characters')).toBeVisible();
  },
};

export const WithCharCountAndMaxLength: Story = {
  args: {
    label: 'With charcount',
    showCharCount: true,
    maxLength: 100,
  },

  parameters: {
    formik: {
      initialValues: {'my-textfield': ''},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('With charcount');
    await userEvent.type(input, 'Foo');

    expect(await canvas.findByText('97 characters remaining')).toBeVisible();
  },
};
