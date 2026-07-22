import type {IbanComponentSchema} from '@open-formulieren/types';
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
      description: 'IBAN component type label',
      defaultMessage: 'IBAN',
    }),
  },
  builderInfo: {
    title: 'IBAN',
    icon: 'wallet',
    schema: {
      id: 'yejak',
      type: 'iban',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
  holdsData: true,
} satisfies RegistryEntry<IbanComponentSchema>;
