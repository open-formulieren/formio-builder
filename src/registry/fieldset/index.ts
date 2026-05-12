import {FieldsetComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
    // @TODO add designer preview
  },
  formDesigner: {
    label: defineMessage({
      description: 'Fieldset component type label',
      defaultMessage: 'Fieldset',
    }),
  },
  builderInfo: {
    title: 'Fieldset',
    icon: 'th-large',
    schema: {
      id: 'eqegfc',
      type: 'fieldset',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: undefined, // a fieldset component does not hold a value itself
} satisfies RegistryEntry<FieldsetComponentSchema>;
