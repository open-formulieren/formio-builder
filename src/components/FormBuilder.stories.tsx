import type {
  AnyComponentSchema,
  EmailComponentSchema,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {fn} from 'storybook/test';

import {DEFAULT_COLORS} from '@/tests/sharedUtils';

import FormBuilder, {MergedFormBuilderProps} from './FormBuilder';

const StorybookFormBuilder = (props: MergedFormBuilderProps) => {
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
    uniquifyKey: key => key,
    supportedLanguageCodes: ['nl'],
    richTextColors: DEFAULT_COLORS,
    theme: 'light',
    formType: 'regular',
    validatorPlugins: [
      {id: 'phone-intl', label: 'Phone (international)'},
      {id: 'phone-nl', label: 'Phone (Dutch)'},
      {id: 'license-plate', label: 'License plate'},
    ],
    registrationAttributes: [
      {id: 'bsn', label: 'BSN'},
      {id: 'firstName', label: 'First name'},
      {id: 'dob', label: 'Date of Birth'},
    ],
    prefillPlugins: [
      {id: 'stuf-bg', label: 'StUF-BG'},
      {id: 'haalcentraal', label: 'Haal Centraal'},
    ],
    prefillAttributes: {
      'stuf-bg': [
        {id: 'BSN', label: 'BSN'},
        {id: 'geslachtsNaam', label: 'Geslachtsnaam'},
      ],
      haalcentraal: [
        {id: 'burgerservicenummer', label: 'BSN'},
        {id: 'lastName', label: 'Achternaam'},
      ],
    },
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
