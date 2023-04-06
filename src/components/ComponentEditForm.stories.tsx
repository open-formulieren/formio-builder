import React from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';

import ComponentEditForm from './ComponentEditForm';

export default {
  title: 'Edit form/Component edit form',
  component: ComponentEditForm,
} satisfies ComponentMeta<typeof ComponentEditForm>;

export const Default: ComponentStory<typeof ComponentEditForm> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
}) => (
  <ComponentEditForm
    isNew={isNew}
    component={component}
    builderInfo={builderInfo}
    onCancel={onCancel}
    onRemove={onRemove}
  />
);

Default.args = {
  isNew: true,
  component: {
    type: 'textfield',
    label: 'Text field',
    key: 'textField',
  },
  builderInfo: {
    title: 'Text field',
    group: 'basic',
    icon: 'terminal',
    schema: {placeholder: ''},
    weight: 0,
  },
};
