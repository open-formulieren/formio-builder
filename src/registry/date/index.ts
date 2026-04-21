import {DateComponentSchema} from '@open-formulieren/types';
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
      description: 'Date component type label',
      defaultMessage: 'Date',
    }),
  },
  builderInfo: {
    title: 'Date',
    icon: 'calendar',
    schema: {
      id: 'ezftxdl',
      type: 'date',
      ...EditForm.defaultValues,
      datePicker: undefined, // the DatePicker interface otherwise causes TS issues
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<DateComponentSchema>;
