import {CheckboxComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm, {ComparisonValueInput} from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'Checkbox component type label',
      defaultMessage: 'Checkbox',
    }),
  },
  builderInfo: {
    title: 'Checkbox',
    icon: 'check-square',
    schema: {
      id: 'yejak',
      type: 'checkbox',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: false, // formik field value
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<CheckboxComponentSchema>;
