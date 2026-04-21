import {ChildrenComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    // @TODO add designer preview
    // The current admin uses different previews for panel and designer. Check if we can
    // simplify this and use 1 preview variant.
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
