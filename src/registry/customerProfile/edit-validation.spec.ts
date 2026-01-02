import {CustomerProfileComponentSchema} from '@open-formulieren/types';
import {DigitalAddressType} from '@open-formulieren/types/dist/components/customerProfile';

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
    // @ts-expect-error defaultValue cannot be supplied at the component level
    defaultValue: [
      {address: 'test@mail.com', type: 'email'},
      {address: '+31612345678', type: 'phoneNumber'},
    ],
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(false);
});

// The current backend formio.js code uses `null` as a fallback for falsy defaultValues.
// This is behaviour that we have to accept for now. This is not allowed by the
// TypeScript definition, but it's a valid value in the formio-builder and backend.
test('CustomerProfile component with defaultValues `null` passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: CustomerProfileComponentSchema = {
    id: 'customerProfile',
    type: 'customerProfile',
    label: 'Customer profile',
    key: 'customerProfile',
    // @ts-expect-error Because the TypeScript definition of this component doesn't allow
    // `null`, we have to annotate this with 'expect error'.
    defaultValue: null,
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
