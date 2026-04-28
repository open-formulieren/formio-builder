import {ColumnsComponentSchema} from '@open-formulieren/types';

import {COMPONENT_TYPE_LABELS} from '@/registry/messages';
import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';
import './previews.scss';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
  },
  formDesigner: {
    icon: 'columns',
    label: intl => intl.formatMessage(COMPONENT_TYPE_LABELS.columns),
  },
  defaultValue: undefined, // a column component does not hold a value itself
} satisfies RegistryEntry<ColumnsComponentSchema>;
