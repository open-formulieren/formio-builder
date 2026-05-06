import {ChildrenComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import DesignerPreview from './designer-preview';
import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    designer: DesignerPreview,
  },
  defaultValue: [],
} satisfies RegistryEntry<ChildrenComponentSchema>;
