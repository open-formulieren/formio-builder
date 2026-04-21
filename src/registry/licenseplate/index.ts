import {LicensePlateComponentSchema} from '@open-formulieren/types';
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
      description: 'Licenseplate component type label',
      defaultMessage: 'License plate',
    }),
  },
  builderInfo: {
    title: 'License plate',
    icon: 'car',
    schema: {
      id: 'yejak',
      type: 'licenseplate',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<LicensePlateComponentSchema>;
