import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

// Constraints taken from the BRK API (apart from postcode which comes from our postcode component)
const addressSchema = z.object({
  postcode: z.string().regex(/^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$/),
  housenumber: z.string().regex(/^\d{1,5}$/),
  houseletter: z.string().regex(/^[a-zA-Z]$/),
  housenumberaddition: z
    .string()
    .regex(/^([a-z,A-Z,0-9]){1,4}$/)
    .optional(),
});

const defaultValueSchema = z.object({defaultValue: addressSchema});

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(defaultValueSchema);

export default schema;
