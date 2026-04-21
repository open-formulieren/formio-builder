import {ChildrenComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '../types';
import DesignerPreview from './designer-preview';
import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    designer: DesignerPreview,
  },
  formDesigner: {
    label: defineMessage({
      description: 'Children component type label',
      defaultMessage: 'Children',
    }),
  },
  builderInfo: {
    title: 'Children',
    icon: 'children',
    schema: {
      id: 'yejak',
      type: 'children',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: [],
} satisfies RegistryEntry<ChildrenComponentSchema>;
