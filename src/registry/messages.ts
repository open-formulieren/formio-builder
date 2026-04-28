import type {AnyComponentSchema} from '@open-formulieren/types';
import {defineMessages} from 'react-intl';

export const COMPONENT_TYPE_LABELS = defineMessages<AnyComponentSchema['type']>({
  textfield: {
    description: 'Textfield component type label',
    defaultMessage: 'Textfield',
  },
  textarea: {
    description: 'Textarea component type label',
    defaultMessage: 'Textarea',
  },
  number: {
    description: 'Number component type label',
    defaultMessage: 'Number',
  },
  checkbox: {
    description: 'Checkbox component type label',
    defaultMessage: 'Checkbox',
  },
  selectboxes: {
    description: 'Selectboxes component type label',
    defaultMessage: 'Selectboxes',
  },
  select: {
    description: 'Select component type label',
    defaultMessage: 'Select',
  },
  radio: {
    description: 'Radio component type label',
    defaultMessage: 'Radio',
  },
  currency: {
    description: 'Currency component type label',
    defaultMessage: 'Currency',
  },
  email: {
    description: 'Email component type label',
    defaultMessage: 'Email',
  },
  date: {
    description: 'Date component type label',
    defaultMessage: 'Date',
  },
  datetime: {
    description: 'Datetime component type label',
    defaultMessage: 'Date & time',
  },
  time: {
    description: 'Time component type label',
    defaultMessage: 'Time',
  },
  phoneNumber: {
    description: 'PhoneNumber component type label',
    defaultMessage: 'Phone number',
  },
  postcode: {
    description: 'Postcode component type label',
    defaultMessage: 'Postcode',
  },
  file: {
    description: 'File component type label',
    defaultMessage: 'File upload',
  },
  iban: {
    description: 'IBAN component type label',
    defaultMessage: 'IBAN',
  },
  licenseplate: {
    description: 'Licenseplate component type label',
    defaultMessage: 'License plate',
  },
  bsn: {
    description: 'BSN component type label',
    defaultMessage: 'BSN',
  },
  npFamilyMembers: {
    description: 'NpFamilyMembers component type label',
    defaultMessage: 'Family members',
  },
  signature: {
    description: 'Signature component type label',
    defaultMessage: 'Signature',
  },
  cosign: {
    description: 'Cosign v2 component type label',
    defaultMessage: 'Co-sign',
  },
  map: {
    description: 'Map component type label',
    defaultMessage: 'Map',
  },
  editgrid: {
    description: 'Editgrid component type label',
    defaultMessage: 'Repeating group',
  },
  addressNL: {
    description: 'AddressNL component type label',
    defaultMessage: 'AddressNL',
  },
  partners: {
    description: 'Partners component type label',
    defaultMessage: 'Partners',
  },
  children: {
    description: 'Children component type label',
    defaultMessage: 'Children',
  },
  customerProfile: {
    description: 'CustomerProfile component type label',
    defaultMessage: 'Profile',
  },
  content: {
    description: 'Content component type label',
    defaultMessage: 'Content',
  },
  fieldset: {
    description: 'Fieldset component type label',
    defaultMessage: 'Fieldset',
  },
  columns: {
    description: 'Columns component type label',
    defaultMessage: 'Columns',
  },
  softRequiredErrors: {
    description: 'SoftRequiredErrors component type label',
    defaultMessage: 'Soft required errors',
  },
  coSign: {
    description: 'CoSign v1 component type label',
    defaultMessage: 'Co-sign',
  },
});
