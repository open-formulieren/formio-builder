import type {TimeComponentSchema} from '@open-formulieren/types';
import {expect, test} from 'vitest';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import schemaFactory from './edit-validation';

// All fields that take a time value, should conform to the HH:mm:ss pattern
test.each([
  ['00:00', false],
  ['00:00:00', true],
])(
  'A Time component with defaultValue, minTime and maxTime %s (expected %s)',
  (value, expectedResult) => {
    const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
    const component: TimeComponentSchema = {
      id: 'time',
      type: 'time',
      key: 'time',
      label: 'Time',
      multiple: false,
    };

    const {success} = schema.safeParse({
      ...component,
      defaultValue: value,
      validate: {
        minTime: value,
        maxTime: value,
      },
    });

    expect(success).toBe(expectedResult);
  }
);
