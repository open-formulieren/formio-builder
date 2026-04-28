import {LicensePlateComponentSchema} from '@open-formulieren/types';

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
    icon: 'car',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.licenseplate),
  },
  defaultValue: '',
} satisfies RegistryEntry<LicensePlateComponentSchema>;
