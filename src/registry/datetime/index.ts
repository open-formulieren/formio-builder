import {DateTimeComponentSchema} from '@open-formulieren/types';
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
      description: 'Datetime component type label',
      defaultMessage: 'Date & time',
    }),
  },
  builderInfo: {
    title: 'Date / time',
    icon: 'calendar-plus',
    schema: {
      id: 'ezftxdl',
      type: 'datetime',
      ...EditForm.defaultValues,
      datePicker: undefined, // the DatePicker interface otherwise causes TS issues
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<DateTimeComponentSchema>;
