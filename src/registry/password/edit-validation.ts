import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

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

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(defaultValueSchema);

export default schema;
