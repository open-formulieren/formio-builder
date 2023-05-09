import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import ComponentPreview from './ComponentPreview';

export default {
  title: 'Edit form/ComponentPreview',
  component: ComponentPreview,
} as ComponentMeta<typeof ComponentPreview>;

const Template: ComponentStory<typeof ComponentPreview> = ({component}) => (
  <ComponentPreview component={component} />
);

export const Default = Template.bind({});
Default.args = {
  component: {
    id: 'foo',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};

export const Fallback = Template.bind({});
Fallback.args = {
  component: {
    id: 'fallback',
    // should never accidentally be an actual type
    type: '85230383-896e-40ce-a1a9-35a090b73f17',
  },
};
Fallback.play = async ({canvasElement}) => {
  const canvas = await within(canvasElement);
  await canvas.findByTestId('jsonPreview');
};

export const TextField = Template.bind({});
TextField.args = {
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
};
TextField.play = async ({canvasElement, args}) => {
  const canvas = await within(canvasElement);

  // check that the user-controlled content is visible
  await canvas.findByText('Textfield preview');
  await canvas.findByText('A preview of the textfield Formio component');

  // check that the input name is set correctly
  const input = await canvas.getByLabelText('Textfield preview');
  await expect(input.getAttribute('name')).toBe(args.component.key);

  // check that user can type into the field
  await userEvent.type(input, 'typing in preview component');
  await expect(input).toHaveDisplayValue('typing in preview component');
};

export const TextFieldMultiple = Template.bind({});
TextFieldMultiple.parameters = {
  formik: {
    initialValues: {
      textfieldMultiplePreview: [],
    },
  },
};
TextFieldMultiple.args = {
  component: {
    type: 'textfield',
    id: 'textfieldMultiple',
    key: 'textfieldMultiplePreview',
    label: 'Textfield multiple preview',
    multiple: true,
    description: 'Description only once',
    showCharCount: true,
  },
};
TextFieldMultiple.play = async ({canvasElement}) => {
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
};
