import {SignatureComponentSchema} from '@open-formulieren/types';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';
import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview},
  formDesigner: {
    icon: 'pencil',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.signature),
  },
  defaultValue: '',
} satisfies RegistryEntry<SignatureComponentSchema>;
