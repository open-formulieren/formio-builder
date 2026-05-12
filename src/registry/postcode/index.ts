import {PostcodeComponentSchema} from '@open-formulieren/types';
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
      description: 'Postcode component type label',
      defaultMessage: 'Postcode',
    }),
  },
  builderInfo: {
    title: 'Postcode',
    icon: 'home',
    schema: {
      id: 'yejak',
      type: 'postcode',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<PostcodeComponentSchema>;
