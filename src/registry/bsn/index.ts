import type {BsnComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'BSN component type label',
      defaultMessage: 'BSN',
    }),
  },
  builderInfo: {
    title: 'BSN',
    icon: 'id-card-o',
    schema: {
      id: 'yejak',
      type: 'bsn',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
  holdsData: true,
} satisfies RegistryEntry<BsnComponentSchema>;
