import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';
import React from 'react';

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
