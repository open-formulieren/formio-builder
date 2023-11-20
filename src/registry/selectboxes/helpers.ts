import {SelectboxesComponentSchema} from '@open-formulieren/types';
import {Option} from '@open-formulieren/types/lib/formio/common';

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsManualOptions = (
  component: SelectboxesComponentSchema
): component is SelectboxesComponentSchema & {values: Option[] | undefined} => {
  return component.openForms.dataSrc === 'manual';
};
