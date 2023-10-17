import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema, buildKeySchema} from '@/registry/validation';

const dateSchema = z.coerce.date().optional();

// case for when component.multiple=false
const singleValueSchema = z
  .object({multiple: z.literal(false)})
  .and(z.object({defaultValue: dateSchema}));

// case for when component.multiple=true
const multipleValueSchema = z
  .object({multiple: z.literal(true)})
  .and(z.object({defaultValue: dateSchema.array()}));

const defaultValueSchema = singleValueSchema.or(multipleValueSchema);

// formik (deliberately) turns empty string into undefined
const noMode = z.object({mode: z.union([z.literal(undefined), z.literal('')])});
const future = z.object({
  mode: z.literal('future'),
});
const past = z.object({
  mode: z.literal('past'),
});

const buildRelativeToVariable = (intl: IntlShape) =>
  z.object({
    mode: z.literal('relativeToVariable'),
    operator: z.literal('add').or(z.literal('subtract')),
    variable: buildKeySchema(intl),
    delta: z.object({
      years: z.null().or(z.number().int().gte(0)).optional(),
      months: z.null().or(z.number().int().gte(0)).optional(),
      days: z.null().or(z.number().int().gte(0)).optional(),
    }),
  });

const buildDateSpecific = (intl: IntlShape) =>
  z.object({
    openForms: z
      .object({
        minDate: z.union([noMode, future, buildRelativeToVariable(intl)]),
        maxDate: z.union([noMode, past, buildRelativeToVariable(intl)]),
      })
      .optional(),
  });

const schema = (intl: IntlShape) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(buildDateSpecific(intl));

export default schema;
