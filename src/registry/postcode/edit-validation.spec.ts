import type {PostcodeComponentSchema} from '@open-formulieren/types';
import type {Prefill} from '@open-formulieren/types/dist/extensions';
import {expect, test} from 'vitest';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import {POSTCODE_REGEX} from './constants';
import schemaFactory from './edit-validation';

interface NonStrictPrefill {
  plugin: string;
  attribute: string;
  identifierRole: string;
}

test.each(['main', 'authorised_person'])(
  'Prefill with valid values validates',
  (identifierRole: NonNullable<Prefill['prefill']>['identifierRole']) => {
    const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
    const component: PostcodeComponentSchema = {
      id: 'postcode',
      type: 'postcode',
      key: 'postcode',
      label: 'Postcode',
      validate: {pattern: POSTCODE_REGEX},
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
    const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
    const component: PostcodeComponentSchema = {
      id: 'postcode',
      type: 'postcode',
      key: 'postcode',
      label: 'Postcode',
      validate: {pattern: POSTCODE_REGEX},
      multiple: false,
    };

    const {success} = schema.safeParse({...component, prefill});

    expect(success).toBe(false);
  }
);
