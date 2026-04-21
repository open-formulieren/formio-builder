import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: null,
  },
  formDesigner: {
    icon: 'triangle-exclamation',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.softRequiredErrors),
  },
  defaultValue: undefined, // a softRequiredErrors component does not hold a value itself
} satisfies RegistryEntry<SoftRequiredErrorsComponentSchema>;
