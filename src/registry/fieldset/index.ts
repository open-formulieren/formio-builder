import type {FieldsetComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '@/registry/types';

import DesignerPreview from './designer-preview';
import EditForm from './edit';
import validationSchema from './edit-validation';
import PanelPreview from './panel-preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: PanelPreview,
    designer: DesignerPreview,
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
  getComponentSlots: component => [
    {
      reference: component.key,
      collection: component.components,
    },
  ],
} satisfies RegistryEntry<FieldsetComponentSchema>;
