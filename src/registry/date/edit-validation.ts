import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const dateSchema = z.coerce.date().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: dateSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: dateSchema.array()}));

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const dateSpecific = z.object({});

const schema = (intl: IntlShape) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(dateSpecific);

export default schema;
