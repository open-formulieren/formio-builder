import {EditGridComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
  },
  defaultValue: [],
} satisfies RegistryEntry<EditGridComponentSchema>;
