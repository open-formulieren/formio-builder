/**
 * Zod schemas for builder form validation.
 *
 * TODO: check the zodErrorMap implementation & patterns in the SDK for a default error
 * map.
 */
import {InferenceError} from '@open-formulieren/infernologic/lib/exceptions';
import {IntlShape, defineMessages} from 'react-intl';
import {z} from 'zod';

import type {BuilderContextType} from '@/context';

/*
  Validation message definitions.
 */

const DEFAULT_MESSAGES = defineMessages({
  required: {
    description: "Form builder label field 'required' validation error",
    defaultMessage: 'Label is a required field.',
  },
  invalidKeyPattern: {
    description: "Form builder 'key' pattern validation error",
    defaultMessage:
      'The property name must only contain alphanumeric characters, underscores, dots and dashes and should not be ended by dash or dot.',
  },
});

/*
Public API
 */

/**
 * Construct the localised validation schema for the component.label property.
 *
 * Component label is (typically) a required text for Form.io components.
 */
export const buildLabelSchema = (intl: IntlShape): z.ZodString =>
  z.string({
    errorMap: getErrorMap((issue, ctx) => {
      const isRequiredError = issue.code === 'invalid_type' && ctx.data === undefined;
      if (isRequiredError) {
        return intl.formatMessage(DEFAULT_MESSAGES.required);
      }
      return;
    }),
  });

/**
 * Construct the localised validation schema for the component.key property.
 *
 * The component key is used in the submission data and support lodash.get/set patterns.
 * It must allow slug-characters, amended with underscores and dots for nested data
 * lookups/setters. It may not end with a dash or dot for nested-data reasons.
 */
export const buildKeySchema = (intl: IntlShape): z.ZodString =>
  z
    .string({
      errorMap: getErrorMap(issue => {
        if (isInvalidStringIssue(issue) && issue.validation === 'regex') {
          return intl.formatMessage(DEFAULT_MESSAGES.invalidKeyPattern);
        }
        return;
      }),
    })
    .regex(new RegExp('^(\\w|\\w[\\w-.]*\\w)$'));

/**
 * Construct the localised validation schema shared by (most) Form.io components.
 *
 * You can use the output of this base schema with the `.and(...)` chain for additional
 * component-type specific schema validations that are not/less generic in nature.
 */
export const buildCommonSchema = (intl: IntlShape) =>
  z.object({
    label: buildLabelSchema(intl),
    key: buildKeySchema(intl),
  });

// From https://zod.dev/?id=json-type
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | {[key: string]: Json} | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

// Maps to @open-formulieren/types common.ts Option type.
const optionTranslationSchema = z.object({
  label: z.string(),
});

export const optionSchema = (intl: IntlShape) =>
  z.object({
    value: z
      .string({
        required_error: intl.formatMessage({
          description: 'Form builder option value required error',
          defaultMessage: 'The option value is a required field.',
        }),
      })
      .min(1),
    label: z
      .string({
        required_error: intl.formatMessage({
          description: 'Form builder option label required error',
          defaultMessage: 'The option label is a required field.',
        }),
      })
      .min(1),
    openForms: z
      .object({
        // zod doesn't seem to be able to use our supportedLanguageCodes for z.object keys,
        // they need to be defined statically. So, 'record' it is.
        translations: z.record(optionTranslationSchema.optional()),
      })
      .optional(),
  });

/*
Helpers
 */

export const isInvalidStringIssue = (
  issue: z.ZodIssueOptionalMessage
): issue is z.ZodInvalidStringIssue => {
  return issue.code === 'invalid_string';
};

type ErrorBuilder = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => string | void;

export const getErrorMap = (builder: ErrorBuilder): z.ZodErrorMap => {
  const errorMap = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
    const message = builder(issue, ctx);
    if (message) {
      return {message};
    }
    return {message: ctx.defaultError};
  };
  return errorMap;
};

/*
Related to jsonLogic
 */

export const itemsExpressionSchema = (builderContext: BuilderContextType) =>
  jsonSchema.superRefine((val, ctx) => {
    try {
      builderContext.validateLogic(val, [['', '']]);
    } catch (error) {
      if (error instanceof InferenceError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid JSON Logic: ${error.message}`,
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Something went wrong when validating items expression: ${error.message}`,
        });
      }
    }
  });
