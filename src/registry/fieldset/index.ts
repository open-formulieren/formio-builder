import {FieldsetComponentSchema} from '@open-formulieren/types';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';
import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
  },
  formDesigner: {
    icon: 'th-large',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.fieldset),
  },
  defaultValue: undefined, // a fieldset component does not hold a value itself
} satisfies RegistryEntry<FieldsetComponentSchema>;
