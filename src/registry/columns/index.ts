import {ColumnsComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';
import './previews.scss';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
  },
  defaultValue: undefined, // a column component does not hold a value itself
} satisfies RegistryEntry<ColumnsComponentSchema>;
