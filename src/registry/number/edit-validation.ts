import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const numberSchema = z.number().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: numberSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: numberSchema.array()}));

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const numberSpecific = z.object({
  decimalLimit: z.number().int().positive().optional(),
  validate: z
    .object({
      min: z.number().finite().optional(),
      max: z.number().finite().optional(),
    })
    .optional(),
});

const schema = (intl: IntlShape) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(numberSpecific);

export default schema;
