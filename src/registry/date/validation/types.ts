import {DateComponentSchema} from '@open-formulieren/types';
import {DateConstraintConfiguration} from '@open-formulieren/types/lib/formio/dates';

import {FilterByValueType} from '@/types';

// A bunch of derived types from the DateComponentSchema that makes working with the
// schema a bit more readable while keeping everything exhaustive and type safe.
type AllDateExtensions = Required<NonNullable<DateComponentSchema['openForms']>>;

export type AllModes = DateConstraintConfiguration['mode'];
export type NonEmptyModes = Exclude<AllModes, ''>;
export type DateConstraintKey = keyof FilterByValueType<AllDateExtensions, {mode: AllModes}>;
export type AllPossibleConstraints = AllDateExtensions[DateConstraintKey];
