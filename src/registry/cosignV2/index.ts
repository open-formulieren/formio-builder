import {CosignV2ComponentSchema} from '@open-formulieren/types';
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
      description: 'Cosign v2 component type label',
      defaultMessage: 'Co-sign',
    }),
  },
  builderInfo: {
    title: 'Co-sign',
    icon: 'pen-nib',
    schema: {
      id: 'yejak',
      type: 'cosign',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: '',
} satisfies RegistryEntry<CosignV2ComponentSchema>;
