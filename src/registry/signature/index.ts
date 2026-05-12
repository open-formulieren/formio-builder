import {SignatureComponentSchema} from '@open-formulieren/types';
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
      description: 'Signature component type label',
      defaultMessage: 'Signature',
    }),
  },
  builderInfo: {
    title: 'Signature',
    icon: 'pencil',
    schema: {
      id: 'yejak',
      type: 'signature',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<SignatureComponentSchema>;
