// a hack - this library has side effects because it patches L from leaflet.
import {MapComponentSchema} from '@open-formulieren/types';
import 'proj4leaflet';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';
import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview},
  formDesigner: {
    icon: 'map',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.map),
  },
  defaultValue: undefined,
} satisfies RegistryEntry<MapComponentSchema>;
