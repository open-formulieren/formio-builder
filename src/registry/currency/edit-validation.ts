import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

// undefined (optional) for unspecified, otherwise a finite numeric value. Note that
// null would be nicer, but formio's schema does not support null for validate.min,
// validate.max or defaultValue
const currencySchema = z.number().finite().optional();

const defaultValueSchema = z.object({defaultValue: currencySchema});

const currencySpecific = z.object({
  decimalLimit: z.union(Array.from({length: 11}, (_, i) => z.literal(i)) as any).optional(),
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
