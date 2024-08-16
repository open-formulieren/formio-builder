import {EditGridComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';
import './previews.scss';
import StructureSubtreePreview from './structure-preview';
import WebformPreview from './webform-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
    structureSubtree: StructureSubtreePreview,
    webform: WebformPreview,
  },
  defaultValue: [],
} satisfies RegistryEntry<EditGridComponentSchema>;
