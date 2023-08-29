import {Meta, StoryFn, StoryObj} from '@storybook/react';

import ComponentEditForm from './ComponentEditForm';

export default {
  title: 'Edit form/Component edit form',
  component: ComponentEditForm,
} as Meta<typeof ComponentEditForm>;

export const Default: StoryObj<typeof ComponentEditForm> = {
  render: ({isNew, component, builderInfo, onCancel, onRemove, onSubmit}) => (
    <ComponentEditForm
      isNew={isNew}
      component={component}
      builderInfo={builderInfo}
      onCancel={onCancel}
      onRemove={onRemove}
      onSubmit={onSubmit}
    />
  ),

  args: {
    isNew: true,
    component: {
      id: 'wekruya',
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
  },
};
