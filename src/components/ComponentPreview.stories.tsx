import React from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';

import ComponentPreview from './ComponentPreview';

export default {
  title: 'Edit form/ComponentPreview',
  component: ComponentPreview,
} as ComponentMeta<typeof ComponentPreview>;

export const Default: ComponentStory<typeof ComponentPreview> = ({component}) => (
  <ComponentPreview component={component}></ComponentPreview>
);

Default.args = {
  component: {
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};
