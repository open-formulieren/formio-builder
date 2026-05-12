import {EditGridComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
    // @TODO add designer preview
  },
  formDesigner: {
    label: defineMessage({
      description: 'Editgrid component type label',
      defaultMessage: 'Repeating group',
    }),
  },
  builderInfo: {
    title: 'Repeating group',
    icon: 'repeat',
    schema: {
      id: 'yejak',
      type: 'editgrid',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: [],
} satisfies RegistryEntry<EditGridComponentSchema>;
