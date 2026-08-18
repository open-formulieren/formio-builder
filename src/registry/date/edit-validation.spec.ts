import type {DateComponentSchema} from '@open-formulieren/types';
import type {Prefill} from '@open-formulieren/types/dist/extensions';
import {expect, test} from 'vitest';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import {default as buildSchema} from './edit-validation';

test('maxDate: fixedValue mode, valid', () => {
  const component: DateComponentSchema = {
    id: 'asldfj',
    type: 'date',
    label: 'A date',
    key: 'aDate',
    multiple: false,
    openForms: {
      maxDate: {
        mode: 'fixedValue',
      },
      minDate: {mode: ''},
      translations: {},
    },
    datePicker: {
      minDate: null,
      maxDate: '2024-01-01',
    },
  };
  const schema = buildSchema({intl: dummyIntl, builderContext: dummyBuilderContext});

  const {success} = schema.safeParse(component);

  expect(success).toBe(true);
});

test.each(['', null, '2024-13'])("maxDate: fixedValue mode, invalid (date value '%s')", value => {
  const component: DateComponentSchema = {
    id: 'asldfj',
    type: 'date',
    label: 'A date',
    key: 'aDate',
    multiple: false,
    openForms: {
      maxDate: {
        mode: 'fixedValue',
      },
      minDate: {mode: ''},
      translations: {},
    },
    datePicker: {
      minDate: null,
      maxDate: value,
    },
  };
  const schema = buildSchema({intl: dummyIntl, builderContext: dummyBuilderContext});

  const {success} = schema.safeParse(component);

  expect(success).toBe(false);
});

test('maxDate: may be undefined', () => {
  const component: DateComponentSchema = {
    id: 'asldfj',
    type: 'date',
    label: 'A date',
    key: 'aDate',
    multiple: false,
    openForms: {
      translations: {},
    },
    datePicker: {
      minDate: null,
      maxDate: '2024-01-01',
    },
  };
  const schema = buildSchema({intl: dummyIntl, builderContext: dummyBuilderContext});

  const {success} = schema.safeParse(component);

  expect(success).toBe(true);
});

interface NonStrictPrefill {
  plugin: string;
  attribute: string;
  identifierRole: string;
}

test.each(['main', 'authorised_person'])(
  'Prefill with valid values validates',
  (identifierRole: NonNullable<Prefill['prefill']>['identifierRole']) => {
    const schema = buildSchema({intl: dummyIntl, builderContext: dummyBuilderContext});
    const component: DateComponentSchema = {
      id: 'date',
      type: 'date',
      key: 'date',
      label: 'Date',
      multiple: false,
      prefill: {plugin: 'demo', attribute: 'someAttr', identifierRole},
    };

    const {success} = schema.safeParse(component);

    expect(success).toBe(true);
  }
);

test.each([
  {plugin: 'demo', attribute: '', identifierRole: 'main'},
  {plugin: '', attribute: 'someAttr', identifierRole: 'main'},
  {plugin: 'demo', attribute: 'someAttr', identifierRole: 'invalid'},
] satisfies NonStrictPrefill[])(
  'Incomplete/incorrect prefill configuration does not validate',
  prefill => {
    const schema = buildSchema({intl: dummyIntl, builderContext: dummyBuilderContext});
    const component: DateComponentSchema = {
      id: 'date',
      type: 'date',
      key: 'date',
      label: 'Date',
      multiple: false,
    };

    const {success} = schema.safeParse({...component, prefill});

    expect(success).toBe(false);
  }
);
