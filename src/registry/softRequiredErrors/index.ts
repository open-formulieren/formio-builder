import type {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '../types';
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
      description: 'SoftRequiredErrors component type label',
      defaultMessage: 'Soft required errors',
    }),
  },
  builderInfo: {
    title: 'Soft required errors',
    icon: 'triangle-exclamation',
    schema: {
      id: 'iitral8',
      type: 'softRequiredErrors',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // a softRequiredErrors component does not hold a value itself
} satisfies RegistryEntry<SoftRequiredErrorsComponentSchema>;
