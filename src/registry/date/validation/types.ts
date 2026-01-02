import {DateComponentSchema} from '@open-formulieren/types';

import {FilterByValueType} from '@/types';

// A bunch of derived types from the DateComponentSchema that makes working with the
// schema a bit more readable while keeping everything exhaustive and type safe.
type AllDateExtensions = Required<NonNullable<DateComponentSchema['openForms']>>;

export type AllModes = {
  [K in keyof AllDateExtensions]: AllDateExtensions[K] extends {mode: infer U} ? U : never;
}[keyof AllDateExtensions];
export type NonEmptyModes = Exclude<AllModes, ''>;
export type DateConstraintKey = keyof FilterByValueType<AllDateExtensions, {mode: AllModes}>;
export type AllPossibleConstraints = AllDateExtensions[DateConstraintKey];
