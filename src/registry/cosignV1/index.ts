import {CosignV1ComponentSchema} from '@open-formulieren/types';

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
    icon: 'id-card-o',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.coSign),
  },
  // component does not have a submission value but acts as a marker
  defaultValue: undefined,
} satisfies RegistryEntry<CosignV1ComponentSchema>;
