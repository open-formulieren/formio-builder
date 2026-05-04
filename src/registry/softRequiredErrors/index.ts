import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import DesignerPreview from './designer-preview';
import EditForm from './edit';
import validationSchema from './edit-validation';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: null,
    designer: DesignerPreview,
  },
  defaultValue: undefined, // a softRequiredErrors component does not hold a value itself
} satisfies RegistryEntry<SoftRequiredErrorsComponentSchema>;
