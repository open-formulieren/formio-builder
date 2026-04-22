import {CheckboxComponentSchema} from '@open-formulieren/types';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';
import {RegistryEntry} from '@/registry/types';

import EditForm, {ComparisonValueInput} from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview},
  formDesigner: {
    icon: 'check-square',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.checkbox),
  },
  defaultValue: false, // formik field value
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<CheckboxComponentSchema>;
