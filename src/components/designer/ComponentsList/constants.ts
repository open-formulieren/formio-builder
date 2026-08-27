import {defineMessages} from 'react-intl';

import type {
  ComponentGroup,
  GroupName,
  PresetComponentConfiguration,
} from '@/components/designer/types';
import type {FormType} from '@/context';

export const FORM_DESIGNER_GROUP_LABELS = defineMessages<GroupName>({
  basic: {
    description: 'Basic components group label',
    defaultMessage: 'Form fields',
  },
  layout: {
    description: 'Layout components group label',
    defaultMessage: 'Layout',
  },
  special: {
    description: 'Special components group label',
    defaultMessage: 'Special fields',
  },
  preset: {
    description: 'Preset components group label',
    defaultMessage: 'Preset',
  },
});

export const FORM_TYPE_FORM_DESIGNER_GROUPS: Record<FormType, ComponentGroup[]> = {
  regular: [
    {
      name: 'basic',
      components: [
        'textfield',
        'email',
        'date',
        'datetime',
        'time',
        'phoneNumber',
        'postcode',
        'file',
        'textarea',
        'number',
        'checkbox',
        'selectboxes',
        'select',
        'currency',
        'radio',
      ],
    },
    {
      name: 'special',
      components: [
        'iban',
        'licenseplate',
        'bsn',
        'npFamilyMembers',
        'signature',
        'cosign',
        'coSign',
        'addressNL',
        'partners',
        'children',
        'map',
        'editgrid',
        'customerProfile',
      ],
    },
    {
      name: 'layout',
      components: ['content', 'columns', 'fieldset', 'softRequiredErrors'],
    },
  ],
  appointment: [
    {
      name: 'basic',
      components: ['textfield', 'email', 'date', 'phoneNumber', 'radio'],
    },
  ],
  single_step: [
    {
      name: 'basic',
      components: [
        'textfield',
        'email',
        'date',
        'datetime',
        'time',
        'phoneNumber',
        'postcode',
        'textarea',
        'number',
        'checkbox',
        'selectboxes',
        'select',
        'currency',
        'radio',
      ],
    },
    {
      name: 'special',
      components: ['iban', 'licenseplate', 'bsn', 'signature', 'addressNL', 'map', 'editgrid'],
    },
    {
      name: 'layout',
      components: ['content', 'columns', 'fieldset'],
    },
  ],
};

export const FORM_TYPE_USE_PRESETS: Record<FormType, boolean> = {
  regular: true,
  appointment: false,
  single_step: true,
};

export const FORM_DESIGNER_PRESETS: PresetComponentConfiguration[] = [
  {
    label: 'Volledige naam',
    key: 'fullName',
    icon: 'terminal',
    schema: {
      type: 'textfield',
      label: 'Volledige naam',
      autocomplete: 'name',
    },
  },
  {
    label: 'Voornaam',
    key: 'firstName',
    icon: 'terminal',
    schema: {
      type: 'textfield',
      label: 'Voornaam',
      autocomplete: 'given-name',
    },
  },
  {
    label: 'Achternaam',
    key: 'lastName',
    icon: 'terminal',
    schema: {
      type: 'textfield',
      label: 'Achternaam',
      autocomplete: 'family-name',
    },
  },
  {
    label: 'Adresregel 1',
    key: 'addressLine1',
    icon: 'home',
    schema: {
      type: 'textfield',
      label: 'Adresregel 1',
      autocomplete: 'address-line1',
    },
  },
  {
    label: 'Adresregel 2',
    key: 'addressLine2',
    icon: 'home',
    schema: {
      type: 'textfield',
      label: 'Adresregel 2',
      autocomplete: 'address-line2',
    },
  },
  {
    label: 'Adresregel 3',
    key: 'addressLine3',
    icon: 'home',
    schema: {
      type: 'textfield',
      label: 'Adresregel 3',
      autocomplete: 'address-line3',
    },
  },
  {
    label: 'E-mailadres',
    key: 'email',
    icon: 'at',
    schema: {
      type: 'email',
      label: 'E-mailadres',
      autocomplete: 'email',
    },
  },
  {
    label: 'Telefoonnummer',
    key: 'phoneNumber',
    icon: 'phone-square',
    schema: {
      type: 'phoneNumber',
      label: 'Telefoonnummer',
      autocomplete: 'tel',
    },
  },
  {
    label: 'Website',
    key: 'url',
    icon: 'link',
    schema: {
      type: 'textfield',
      label: 'Website',
      autocomplete: 'url',
    },
  },
];
