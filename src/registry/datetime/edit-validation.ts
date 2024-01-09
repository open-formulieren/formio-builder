import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema, buildKeySchema} from '@/registry/validation';

import {EditSchema} from '../types';
import {DateConstraintKey} from './validation/types';

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

// XXX: requires superRefine to enforce datePicker.maxDate etc. to be set!
const fixedValue = z.object({mode: z.literal('fixedValue')});
const date = z.null().or(z.coerce.date());

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

const buildDateTimeSpecific = (intl: IntlShape) =>
  z
    .object({
      openForms: z
        .object({
          minDate: z.union([noMode, fixedValue, future, buildRelativeToVariable(intl)]).optional(),
          maxDate: z.union([noMode, fixedValue, past, buildRelativeToVariable(intl)]).optional(),
        })
        .optional(),
      datePicker: z
        .object({
          minDate: date.optional(),
          maxDate: date.optional(),
        })
        .optional(),
    })
    .superRefine((component, ctx) => {
      for (const constraint of ['minDate', 'maxDate'] satisfies DateConstraintKey[]) {
        const isFixedMode = component?.openForms?.[constraint]?.mode === 'fixedValue';
        if (!isFixedMode) continue;
        const datePickerValue = component?.datePicker?.[constraint];
        if (datePickerValue) continue;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['datePicker', constraint],
          message: intl.formatMessage({
            description: 'Missing datetime value for fixed value validation',
            defaultMessage: 'You must specify a datetime.',
          }),
        });
      }
    });

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(defaultValueSchema).and(buildDateTimeSpecific(intl));

export default schema;
