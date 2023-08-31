import {expect} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import ComponentPreview from './ComponentPreview';

export default {
  title: 'Edit form/ComponentPreview',
  component: ComponentPreview,
} as Meta<typeof ComponentPreview>;

type Story = StoryObj<typeof ComponentPreview>;

const Template: StoryFn<typeof ComponentPreview> = ({component}) => (
  <ComponentPreview component={component} />
);

export const Default: Story = {
  render: Template,

  args: {
    component: {
      id: 'foo',
      type: 'textfield',
      label: 'A text field',
      validate: {
        required: false,
      },
    },
  },
};

export const Fallback: Story = {
  render: Template,

  args: {
    component: {
      id: 'fallback',
      // should never accidentally be an actual type
      type: '85230383-896e-40ce-a1a9-35a090b73f17',
    } as any,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByTestId('jsonPreview');
  },
};

export const TextField: Story = {
  render: Template,

  args: {
    component: {
      type: 'textfield',
      id: 'textfield',
      key: 'textfieldPreview',
      label: 'Textfield preview',
      description: 'A preview of the textfield Formio component',
      hidden: true, // must be ignored
      placeholder: 'Sample placeholder',
      showCharCount: true,
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Textfield preview');
    await canvas.findByText('A preview of the textfield Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Textfield preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, 'typing in preview component');
    await expect(input).toHaveDisplayValue('typing in preview component');
  },
};

export const TextFieldMultiple: Story = {
  render: Template,

  parameters: {
    formik: {
      initialValues: {
        textfieldMultiplePreview: [],
      },
    },
  },

  args: {
    component: {
      type: 'textfield',
      id: 'textfieldMultiple',
      key: 'textfieldMultiplePreview',
      label: 'Textfield multiple preview',
      multiple: true,
      description: 'Description only once',
      showCharCount: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = await canvas.getByTestId('input-textfieldMultiplePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    // during typing, we want immediate charcount feedback
    await userEvent.type(input1, 'Foo');
    await expect(canvas.queryByText('3 characters')).toBeInTheDocument();
    await expect(input1).toHaveDisplayValue('Foo');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId('input-textfieldMultiplePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-textfieldMultiplePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-textfieldMultiplePreview[1]')).not.toBeInTheDocument();
  },
};

export const Email: Story = {
  render: Template,

  args: {
    component: {
      type: 'email',
      id: 'email',
      key: 'emailPreview',
      label: 'Email preview',
      description: 'A preview of the email Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Email preview');
    await canvas.findByText('A preview of the email Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Email preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, 'hello@example.com');
    await expect(input).toHaveDisplayValue('hello@example.com');
  },
};

export const EmailMultiple: Story = {
  render: Template,

  args: {
    component: {
      type: 'email',
      id: 'email',
      key: 'emailPreview',
      label: 'Email preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = await canvas.getByTestId<HTMLInputElement>('input-emailPreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('email');
    // during typing, we want immediate charcount feedback
    await userEvent.type(input1, 'hello@example.com');
    await expect(input1).toHaveDisplayValue('hello@example.com');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-emailPreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-emailPreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-emailPreview[1]')).not.toBeInTheDocument();
  },
};

export const NumberField: Story = {
  render: Template,

  args: {
    component: {
      type: 'number',
      id: 'number',
      key: 'numberPreview',
      label: 'Number preview',
      description: 'A preview of the number Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Number preview');
    await canvas.findByText('A preview of the number Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Number preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, '-3.14');
    await expect(input).toHaveDisplayValue('-3.14');
  },
};
