import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// undefined (optional) for unspecified, otherwise a finite numeric value. Note that
// null would be nicer, but formio's schema does not support null for validate.min,
// validate.max or defaultValue
const numberSchema = z.number().finite().optional();

const defaultValueSchema = z.object({
  defaultValue: numberSchema,
});

const numberSpecific = z.object({
  decimalLimit: z.number().int().positive().optional(),
  validate: z
    .object({
      min: numberSchema,
      max: numberSchema,
    })
    .optional(),
});

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(numberSpecific);

export default schema;
