import {ColumnsComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

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
    // @TODO add designer preview
  },
  formDesigner: {
    label: defineMessage({
      description: 'Columns component type label',
      defaultMessage: 'Columns',
    }),
  },
  builderInfo: {
    title: 'Columns',
    icon: 'columns',
    schema: {
      id: 'eqegfc',
      type: 'columns',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // a column component does not hold a value itself
} satisfies RegistryEntry<ColumnsComponentSchema>;
