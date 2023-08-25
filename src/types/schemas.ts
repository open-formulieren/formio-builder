/**
 * Open Forms specific Formio component schema extensions.
 */
import {
  ContentSchema,
  DateComponentSchema,
  EmailComponentSchema,
  NumberComponentSchema,
  TextFieldComponentSchema,
} from '@open-formulieren/types';

// A fallback, minimal schema to handle the cases where component.type is not in our
// registry.
export interface FallbackSchema {
  type?: string;
}

export type AnyComponentSchema =
  // inputs
  | TextFieldComponentSchema
  | EmailComponentSchema
  | DateComponentSchema
  | NumberComponentSchema
  // layout
  | ContentSchema;
