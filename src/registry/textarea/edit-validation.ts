import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

const textareaSchema = z.string().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: textareaSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: textareaSchema.array()}));

// Omit `autoExpand` as it will be set in the UI via a checkbox
const textareaSpecific = z.object({
  validate: z.object({
    maxLength: z.number().int().gte(1).optional(),
  }),
  rows: z.number().int().gte(1).optional(),
});

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(textareaSpecific).and(defaultValueSchema);

export default schema;
