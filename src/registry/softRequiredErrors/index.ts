import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: null,
  },
  defaultValue: undefined, // a softRequiredErrors component does not hold a value itself
} satisfies RegistryEntry<SoftRequiredErrorsComponentSchema>;
