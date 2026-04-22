import {NumberComponentSchema} from '@open-formulieren/types';

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
    icon: 'hashtag',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.number),
  },
  defaultValue: undefined, // formik field value
  comparisonValue: ComparisonValueInput,
} satisfies RegistryEntry<NumberComponentSchema>;
