import type {TextFieldComponentSchema} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';

import {DesignerContextDecorator, withFormik} from '@/sb-decorators';

import FormioDefinitionDesigner from './FormioDefinitionDesigner';

export default {
  title: 'Form designer/Form designer',
  decorators: [withFormik, DesignerContextDecorator],
  component: FormioDefinitionDesigner,
  parameters: {
    modal: {noModal: true},
  },
} satisfies Meta<typeof FormioDefinitionDesigner>;

type Story = StoryObj<typeof FormioDefinitionDesigner>;

export const WithTextfieldComponents: Story = {
  args: {
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
        type: 'textfield',
        id: 'textfield2',
        key: 'textfieldPreview2',
        label: 'A second textfield preview',
        description: 'A preview of the textfield Formio component',
        tooltip: 'A preview of the textfield Formio component',
        defaultValue: 'Default value',
        hidden: false,
        placeholder: 'Sample placeholder',
        showCharCount: true,
      } satisfies TextFieldComponentSchema,
    ],
  },
};
