import {CustomerProfileComponentSchema} from '@open-formulieren/types';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import schemaFactory from './edit-validation';

test('Basic CustomerProfile component passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    digitalAddressTypes: {
      email: true,
      phoneNumber: true,
    },
    shouldUpdateCustomerData: true,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(true);
});

test('CustomerProfile component with defaultValues passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    digitalAddressTypes: {
      email: true,
      phoneNumber: true,
    },
    shouldUpdateCustomerData: true,
    defaultValue: {
      email: {
        address: 'test@mail.com',
      },
      phoneNumber: {
        address: '+31612345678',
      },
    },
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(true);
});

test.each([
  [
    // DigitalAddressTypes requires one option to be true
    {
      email: false,
      phoneNumber: false,
    },
    false,
  ],
  [
    {
      email: true,
      phoneNumber: false,
    },
    true,
  ],
  [
    {
      email: false,
      phoneNumber: true,
    },
    true,
  ],
  [
    {
      email: true,
      phoneNumber: true,
    },
    true,
  ],
])('CustomerProfile requires at least one digitalAddressType', (digitalAddressTypes, expected) => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    digitalAddressTypes: digitalAddressTypes,
    shouldUpdateCustomerData: true,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(expected);
});
