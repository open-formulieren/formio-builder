import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {BuilderContextType} from '@/context';
import {buildCommonSchema, itemsExpressionSchema, optionSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// z.object(...).or(z.object(...)) based on openForms.dataSrc doesn't seem to work,
// looks like the union validation only works if the discriminator is in the top level
// object :(
// so we mark each aspect as optional so that *when* it is provided, we can run the
// validation
const buildValuesSchema = (intl: IntlShape, builderContext: BuilderContextType) =>
  z.object({
    values: optionSchema(intl).array().min(1).optional(),
    openForms: z.object({
      dataSrc: z.union([z.literal('manual'), z.literal('variable')]),
      itemsExpression: itemsExpressionSchema(builderContext).optional(),
    }),
  });

const schema: EditSchema = ({intl, builderContext}) =>
  buildCommonSchema(intl).and(buildValuesSchema(intl, builderContext));

export default schema;
