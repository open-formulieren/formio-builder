import {ContentComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '../types';
import DesignerPreview from './designer-preview';
import EditForm from './edit';
import validationSchema from './edit-validation';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: null,
    designer: DesignerPreview,
  },
  formDesigner: {
    label: defineMessage({
      description: 'Content component type label',
      defaultMessage: 'Content',
    }),
  },
  builderInfo: {
    title: 'Content',
    icon: 'html5',
    schema: {
      id: 'eqegfc',
      type: 'content',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // a content component does not hold a value itself
} satisfies RegistryEntry<ContentComponentSchema>;
