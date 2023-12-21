import {dummyIntl} from '@/tests/test-utils';

import {optionSchema} from './validation';

test.each([['aCamelCaseValue'], ['a value with spaces'], ['a value with $^'], ['123']])(
  'Option value accepts any string',
  (val: string) => {
    const schema = optionSchema(dummyIntl);
    const option = {value: val, label: 'dummy'};

    const {success} = schema.safeParse(option);

    expect(success).toBe(true);
  }
);
