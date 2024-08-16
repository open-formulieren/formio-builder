import {FieldsetComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';
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
  defaultValue: undefined, // a fieldset component does not hold a value itself
} satisfies RegistryEntry<FieldsetComponentSchema>;
