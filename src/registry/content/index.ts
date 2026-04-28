import {ContentComponentSchema} from '@open-formulieren/types';

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
    icon: 'html5',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.content),
  },
  defaultValue: undefined, // a content component does not hold a value itself
} satisfies RegistryEntry<ContentComponentSchema>;
