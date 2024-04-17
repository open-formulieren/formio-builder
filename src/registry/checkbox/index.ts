import {CheckboxComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm, {renderComparisonValueInput} from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: false, // formik field value
  comparisonValue: renderComparisonValueInput,
} satisfies RegistryEntry<CheckboxComponentSchema>;
