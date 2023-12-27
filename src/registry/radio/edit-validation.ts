import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema, jsonSchema, optionSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// z.object(...).or(z.object(...)) based on openForms.dataSrc doesn't seem to work,
// looks like the union validation only works if the discriminator is in the top level
// object :(
// so we mark each aspect as optional so that *when* it is provided, we can run the
// validation
const buildValuesSchema = (intl: IntlShape) =>
  z.object({
    values: optionSchema(intl).array().min(1).optional(),
    openForms: z.object({
      dataSrc: z.union([z.literal('manual'), z.literal('variable')]),
      // TODO: wire up infernologic type checking
      itemsExpression: jsonSchema.optional(),
    }),
  });

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildValuesSchema(intl));

export default schema;
