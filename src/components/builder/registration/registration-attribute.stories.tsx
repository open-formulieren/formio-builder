import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import RegistrationAttributeSelect, {RegistrationAttributeOption} from './registration-attribute';

const DEFAULT_REGISTRATION_ATTRIBUTES: RegistrationAttributeOption[] = [
  {id: 'bsn', label: 'BSN'},
  {id: 'firstName', label: 'First name'},
  {id: 'dob', label: 'Date of Birth'},
];

export default {
  title: 'Formio/Builder/Registration/RegistrationAttributeSelect',
  component: RegistrationAttributeSelect,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    builder: {enableContext: true, registrationAttributesDelay: 100},
    formik: {initialValues: {registration: {attribute: ''}}},
  },
  args: {
    registrationAttributes: DEFAULT_REGISTRATION_ATTRIBUTES,
  },
} as Meta<typeof RegistrationAttributeSelect>;

type Story = StoryObj<typeof RegistrationAttributeSelect>;

export const Default: Story = {};
