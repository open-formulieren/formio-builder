// a hack - this library has side effects because it patches L from leaflet.
import {MapComponentSchema} from '@open-formulieren/types';
import 'proj4leaflet';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: undefined,
} satisfies RegistryEntry<MapComponentSchema>;
