import {SelectboxesComponentSchema} from '@open-formulieren/types';
import {JsonLogicExpression} from '@open-formulieren/types/dist/options';

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsManualOptions = (
  component: SelectboxesComponentSchema
): component is SelectboxesComponentSchema => {
  return component.openForms.dataSrc === 'manual';
};

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsReferenceListsOptions = (
  component: SelectboxesComponentSchema
): component is SelectboxesComponentSchema & {
  openForms: {code: string; service: string};
} => {
  return component.openForms.dataSrc === 'referenceLists';
};

// A type guard is needed because TS cannot figure out it's a discriminated union
// when the discriminator is nested.
// See https://github.com/microsoft/TypeScript/issues/18758
export const checkIsVariableOptions = (
  component: SelectboxesComponentSchema
): component is SelectboxesComponentSchema & {
  openForms: {itemsExpression: JsonLogicExpression};
} => {
  return component.openForms.dataSrc === 'variable';
};
