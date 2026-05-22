import {AddressNLComponentSchema} from '@open-formulieren/types';
import {defineMessage} from 'react-intl';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    designer: Preview,
  },
  formDesigner: {
    label: defineMessage({
      description: 'AddressNL component type label',
      defaultMessage: 'AddressNL',
    }),
  },
  builderInfo: {
    title: 'AddressNL',
    icon: 'home',
    schema: {
      id: 'yejak',
      type: 'addressNL',
      ...EditForm.defaultValues,
    },
  },
  defaultValue: {
    postcode: '',
    houseNumber: '',
    houseLetter: '',
    houseNumberAddition: '',
    city: '',
    streetName: '',
    secretStreetCity: '',
    autoPopulated: false,
  },
} satisfies RegistryEntry<AddressNLComponentSchema>;
