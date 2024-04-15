import {CurrencyComponentSchema} from '@open-formulieren/types';

import {NumberField} from '@/components/formio';
import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: undefined, // formik field value
  comparisonValue: NumberField,
} satisfies RegistryEntry<CurrencyComponentSchema>;
