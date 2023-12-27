import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const passwordSchema = z.string().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: passwordSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: passwordSchema.array()}));
const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(defaultValueSchema);

export default schema;
