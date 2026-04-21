import {EmailComponentSchema} from '@open-formulieren/types';
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
      description: 'Email component type label',
      defaultMessage: 'Email',
    }),
  },
  builderInfo: {
    title: 'Email',
    icon: 'at',
    schema: {
      id: 'yejak',
      type: 'email',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<EmailComponentSchema>;
