import {Meta, StoryFn, StoryObj} from '@storybook/react-webpack5';
import {fn} from 'storybook/test';

import ComponentEditForm from './ComponentEditForm';

export default {
  title: 'Edit form/Component edit form',
  component: ComponentEditForm,
  args: {
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

const render: StoryFn<typeof ComponentEditForm> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}) => (
  <ComponentEditForm
    isNew={isNew}
    component={component}
    builderInfo={builderInfo}
    onCancel={onCancel}
    onRemove={onRemove}
    onSubmit={onSubmit}
  />
);

export const Default: Story = {
  render,

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
