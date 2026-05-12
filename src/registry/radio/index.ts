import {RadioComponentSchema} from '@open-formulieren/types';
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
      description: 'Radio component type label',
      defaultMessage: 'Radio',
    }),
  },
  builderInfo: {
    title: 'Radio',
    icon: 'dot-circle-o',
    schema: {
      id: 'yejak',
      type: 'radio',
      ...EditForm.defaultValues,
    },
  },
  // default empty value for Formik - this ignores any manually configured options!
  defaultValue: '',
} satisfies RegistryEntry<RadioComponentSchema>;
