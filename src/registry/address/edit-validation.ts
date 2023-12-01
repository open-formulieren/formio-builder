import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {POSTCODE_REGEX} from '../postcode/constants';

// Constraints taken from the BRK API (apart from postcode which comes from our postcode component)
const addressSchema = z.object({
  postcode: z.string().regex(new RegExp(POSTCODE_REGEX)).optional(),
  houseNumber: z
    .string()
    .regex(/^\d{1,5}$/)
    .optional(),
  houseLetter: z
    .string()
    .regex(/^[a-zA-Z]$/)
    .optional(),
  houseNumberAddition: z
    .string()
    .regex(/^([a-z,A-Z,0-9]){1,4}$/)
    .optional(),
});

const defaultValueSchema = z.object({defaultValue: addressSchema});

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(defaultValueSchema);

export default schema;
