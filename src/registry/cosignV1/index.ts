import {CosignV1ComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview},
  // component does not have a submission value but acts as a marker
  defaultValue: undefined,
} satisfies RegistryEntry<CosignV1ComponentSchema>;
