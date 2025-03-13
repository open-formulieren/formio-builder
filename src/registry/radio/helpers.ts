import {RadioComponentSchema} from '@open-formulieren/types';
import {Option} from '@open-formulieren/types/lib/formio/common';
import {JSONObject} from '@open-formulieren/types/lib/types';

import {ComponentWithReferentielijsten} from '@/components/builder/values/referentielijsten/types';

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsManualOptions = (
  component: RadioComponentSchema
): component is RadioComponentSchema & {values: Option[] | undefined} => {
  return component.openForms.dataSrc === 'manual';
};

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsReferentielijstenOptions = (
  component: RadioComponentSchema
): component is RadioComponentSchema &
  ComponentWithReferentielijsten & {
    openForms: {code: string; service: string};
  } => {
  return component.openForms.dataSrc === 'referentielijsten';
};

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsVariableOptions = (
  component: RadioComponentSchema
): component is RadioComponentSchema & {
  openForms: {itemsExpression: string | JSONObject};
} => {
  return component.openForms.dataSrc === 'variable';
};
