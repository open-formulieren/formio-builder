import {DateComponentSchema} from '@open-formulieren/types';

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
