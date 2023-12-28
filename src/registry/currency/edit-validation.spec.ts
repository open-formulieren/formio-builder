import {Components} from 'formiojs';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import schemaFactory from './edit-validation';

test('A formio Currency component passes validation', () => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const numberInstance = Components.create(
    {type: 'currency', key: 'currency', label: 'Number', currency: 'EUR'},
    {}
  ) as any;

  const data = numberInstance.component; // this has been extended with the defaults
  // Formio does some really bonkers stuff with setting `validate.min: ''` as a default...
  // By some happy coincidence, it looks like our form builder strips out this data (I
  // think because empty string -> empty & that makes Formik treat it as empty/undefined,
  // which results in the key being removed entirely). Either way, for this test, we can
  // just drop those keys that violate the zod schema, since they would not arrive there
  // because of Formik in the first place.
  delete data.validate.min;
  delete data.validate.max;
  expect(data.defaultValue).toBeNull();

  const {success} = schema.safeParse(data);
  expect(success).toBe(true);
});
