import {FileComponentSchema} from '@open-formulieren/types';
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
      description: 'File component type label',
      defaultMessage: 'File upload',
    }),
  },
  builderInfo: {
    title: 'File upload',
    icon: 'file',
    schema: {
      id: 'yejak',
      type: 'file',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: [],
} satisfies RegistryEntry<FileComponentSchema>;
