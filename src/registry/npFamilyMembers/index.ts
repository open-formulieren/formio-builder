import type {NpFamilyMembersComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import type {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {panel: Preview, designer: Preview},
  formDesigner: {
    label: defineMessage({
      description: 'NpFamilyMembers component type label',
      defaultMessage: 'Family members',
    }),
  },
  builderInfo: {
    title: 'Family members',
    icon: 'users',
    schema: {
      id: '123',
      type: 'npFamilyMembers',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: {},
} satisfies RegistryEntry<NpFamilyMembersComponentSchema>;
