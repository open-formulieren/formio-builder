import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

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

export const Required = {
  args: {
    required: true,
    label: 'A required textfield',
  },
};

export const WithoutLabel = {
  args: {
    label: '',
  },
};

export const WithToolTip = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
    required: false,
  },
};

export const Multiple = {
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
    const input1 = await canvas.getByTestId('input-my-textfield[0]');
    await expect(input1).toHaveDisplayValue('first value');
    await userEvent.clear(input1);
    await userEvent.type(input1, 'Foo');
    await expect(input1).toHaveDisplayValue('Foo');

    const input2 = await canvas.getByTestId('input-my-textfield[1]');
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

export const WithErrors = {
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
