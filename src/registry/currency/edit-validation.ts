import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

// undefined (optional) for unspecified, otherwise a finite numeric value. Note that
// null would be nicer, but formio's schema does not support null for validate.min,
// validate.max or defaultValue
const currencySchema = z.number().finite().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: currencySchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: currencySchema.array()}));

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const currencySpecific = z.object({
  decimalLimit: z.number().int().positive().optional(),
  validate: z
    .object({
      min: currencySchema,
      max: currencySchema,
    })
    .optional(),
});

const schema = (intl: IntlShape) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(currencySpecific);

export default schema;
