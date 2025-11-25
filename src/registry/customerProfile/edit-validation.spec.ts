import {CustomerProfileComponentSchema, DigitalAddressType} from '@open-formulieren/types';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import schemaFactory from './edit-validation';

test('Basic CustomerProfile component passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    digitalAddressTypes: ['email', 'phoneNumber'],
    shouldUpdateCustomerData: true,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(true);
});

test('CustomerProfile component with defaultValues fails validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    digitalAddressTypes: ['email', 'phoneNumber'],
    shouldUpdateCustomerData: true,
    defaultValue: [
      {address: 'test@mail.com', type: 'email'},
      {address: '+31612345678', type: 'phoneNumber'},
    ],
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(false);
});

// This is a special case where Formio assigns a default value of `null` to the field.
// This is not allowed by the typescript definition, but it's a valid value in the
// formio-builder and backend.
test('CustomerProfile component with defaultValues `null` passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    // The typescript definition doesn't allow for `null` as a valid value,
    // but this is the "empty" value formio assigns to the field.
    // So we have to twist the type here to prevent typescript from complaining.
    defaultValue: null as unknown as CustomerProfileComponentSchema['defaultValue'],
    digitalAddressTypes: ['email', 'phoneNumber'],
    shouldUpdateCustomerData: true,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(true);
});

test.each([
  [
    // DigitalAddressTypes requires at least one option
    [],
    false,
  ],
  [['email'], true],
  [['phoneNumber'], true],
  [['email', 'phoneNumber'], true],
])(
  'CustomerProfile requires at least one digitalAddressType',
  (digitalAddressTypes: DigitalAddressType[], expected) => {
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
  }
);

test('CustomerProfile only accepts valid digitalAddressTypes', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    // Forcing an invalid type here to test the validation
    digitalAddressTypes: ['other'] as unknown as DigitalAddressType[],
    shouldUpdateCustomerData: true,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(false);
});
