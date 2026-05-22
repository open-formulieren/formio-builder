import {CustomerProfileComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'CustomerProfile component type label',
      defaultMessage: 'Profile',
    }),
  },
  builderInfo: {
    title: 'Profile',
    icon: 'comments',
    schema: {
      id: '123',
      type: 'customerProfile',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: [],
} satisfies RegistryEntry<CustomerProfileComponentSchema>;
