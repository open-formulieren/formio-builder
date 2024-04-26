import {CurrencyComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm, {ComparisonValueInput} from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: undefined, // formik field value
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<CurrencyComponentSchema>;
