import {AddressNLComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '@/registry/types';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
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
