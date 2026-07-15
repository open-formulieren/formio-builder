import type {CurrencyComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '@/registry/types';

import EditForm, {ComparisonValueInput} from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'Currency component type label',
      defaultMessage: 'Currency',
    }),
  },
  builderInfo: {
    title: 'Currency',
    icon: 'usd',
    schema: {
      id: '123',
      type: 'currency',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // formik field value
  holdsData: true,
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<CurrencyComponentSchema>;
