import {PhoneNumberComponentSchema} from '@open-formulieren/types';
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
      description: 'PhoneNumber component type label',
      defaultMessage: 'Phone number',
    }),
  },
  builderInfo: {
    title: 'Phone number',
    icon: 'phone-square',
    schema: {
      id: 'yejak',
      type: 'phoneNumber',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<PhoneNumberComponentSchema>;
