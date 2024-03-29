import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// undefined (optional) for unspecified, otherwise a finite numeric value. Note that
// null would be nicer, but formio's schema does not support null for validate.min,
// validate.max or defaultValue
const currencySchema = z.number().finite().optional();

const defaultValueSchema = z.object({defaultValue: currencySchema.or(z.null())});

const currencySpecific = z.object({
  decimalLimit: z.number().int().min(0).max(10).optional(),
  validate: z
    .object({
      min: currencySchema,
      max: currencySchema,
    })
    .optional(),
});

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(currencySpecific);

export default schema;
