import {RadioComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  // default empty value for Formik - this ignores any manually configured options!
  defaultValue: '',
} satisfies RegistryEntry<RadioComponentSchema>;
