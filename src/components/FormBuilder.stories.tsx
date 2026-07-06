import type {
  AnyComponentSchema,
  EmailComponentSchema,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {fn} from 'storybook/test';

import FormBuilder, {FormBuilderProps} from './FormBuilder';

const StorybookFormBuilder = (props: FormBuilderProps) => {
  const [components, setComponents] = useState<AnyComponentSchema[]>(props.components);

  return (
    <FormBuilder
      {...props}
      components={components}
      componentNamespace={components.flat(1)}
      onChange={components => setComponents(components)}
    />
  );
};

export default {
  title: 'Generic/Form builder',
  component: FormBuilder,
  render: StorybookFormBuilder,
  parameters: {
    modal: {noModal: true},
  },
  args: {
    onChange: fn(),
    componentNamespace: [],
    components: [
      {
        type: 'textfield',
        id: 'textfield',
        key: 'textfieldPreview',
        label: 'Textfield preview',
        description: 'A preview of the textfield Formio component',
        tooltip: 'A preview of the textfield Formio component',
        defaultValue: 'Default value',
        hidden: false,
        placeholder: 'Sample placeholder',
        showCharCount: true,
      } satisfies TextFieldComponentSchema,
      {
        type: 'email',
        id: 'email',
        key: 'email',
        label: 'A e-mail preview',
        description: 'A preview of the email Formio component',
        tooltip: 'A preview of the email Formio component',
        defaultValue: 'default@mail.com',
        hidden: false,
      } satisfies EmailComponentSchema,
    ],
  },
} as Meta<typeof FormBuilder>;

type Story = StoryObj<typeof FormBuilder>;

export const Default: Story = {};
