import {CosignV1ComponentSchema} from '@open-formulieren/types';
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
      description: 'CoSign v1 component type label',
      defaultMessage: 'Co-sign',
    }),
  },
  builderInfo: {
    title: 'Co-sign',
    icon: 'id-card-o',
    schema: {
      id: 'yejak',
      type: 'coSign',
      ...EditForm.defaultValues,
    },
  },
  // component does not have a submission value but acts as a marker
  defaultValue: undefined,
} satisfies RegistryEntry<CosignV1ComponentSchema>;
