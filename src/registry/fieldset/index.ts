import {FieldsetComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';
import FormPreview from './form-preview';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: undefined, // a fieldset component does not hold a value itself
  formPreview: FormPreview,
} satisfies RegistryEntry<FieldsetComponentSchema>;
