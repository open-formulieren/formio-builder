import {RadioComponentSchema} from '@open-formulieren/types';
import {Option} from '@open-formulieren/types/lib/formio/common';

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsManualOptions = (
  component: RadioComponentSchema
): component is RadioComponentSchema & {values: Option[] | undefined} => {
  return component.openForms.dataSrc === 'manual';
};
