// a hack - this library has side effects because it patches L from leaflet.
import type {MapComponentSchema} from '@open-formulieren/types';
import 'proj4leaflet';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'Map component type label',
      defaultMessage: 'Map',
    }),
  },
  builderInfo: {
    title: 'Map',
    icon: 'map',
    schema: {
      id: 'yejak',
      type: 'map',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined,
  holdsData: true,
} satisfies RegistryEntry<MapComponentSchema>;
