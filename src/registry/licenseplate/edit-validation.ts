import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const licenseplateSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{1,3}\-[a-zA-Z0-9]{1,3}\-[a-zA-Z0-9]{1,3}$/)
  .optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: licenseplateSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: licenseplateSchema.array()}));

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(defaultValueSchema);

export default schema;
