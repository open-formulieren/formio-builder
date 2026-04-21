import {NumberComponentSchema} from '@open-formulieren/types';
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
      description: 'Number component type label',
      defaultMessage: 'Number',
    }),
  },
  builderInfo: {
    title: 'Number',
    icon: 'hashtag',
    schema: {
      id: 'ezftxdl',
      type: 'number',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // formik field value
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<NumberComponentSchema>;
