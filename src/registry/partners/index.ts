import {PartnersComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    designer: Preview,
  },
  formDesigner: {
    label: defineMessage({
      description: 'Partners component type label',
      defaultMessage: 'Partners',
    }),
  },
  builderInfo: {
    title: 'Partners',
    icon: 'users',
    schema: {
      id: 'yejak',
      type: 'partners',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: [],
} satisfies RegistryEntry<PartnersComponentSchema>;
