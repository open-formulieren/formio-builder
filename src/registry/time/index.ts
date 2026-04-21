import {TimeComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'Time component type label',
      defaultMessage: 'Time',
    }),
  },
  builderInfo: {
    title: 'Time',
    icon: 'clock-o',
    schema: {
      id: 'ezftxdl',
      type: 'time',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<TimeComponentSchema>;
