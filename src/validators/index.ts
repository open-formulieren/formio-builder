import set from 'lodash.set';
import {z} from 'zod';

import {EditFormComponentSchema, ExtendedValidateOptions} from '@/types';

import {default as email} from './email';

/*
  Configuration/registry setup
 */

type ZodPrimitiveFactory =
  | typeof z.string
  | typeof z.number
  | typeof z.boolean
  | typeof z.date
  | typeof z.never;

const getZodPrimitiveFactory = (type: string): ZodPrimitiveFactory => {
  switch (type) {
    case 'textfield':
    case 'email': {
      return z.string;
    }
    default: {
      return z.never;
    }
  }
};

export type ValidatorBuilder<T = z.ZodFirstPartySchemaTypes> = (
  schema: T,
  component: EditFormComponentSchema,
  configValue: unknown
) => z.ZodFirstPartySchemaTypes;

const Validators: {[K in ValidatorName]?: ValidatorBuilder} = {
  email: email,
};

/*
  Builder implementation
 */

type ValidatorName = keyof ExtendedValidateOptions;

// Map component type to list of applicable validators, in order of application
type ValidatorConfiguration = {
  [key: string]: ValidatorName[];
};

const ValidatorConfiguration: ValidatorConfiguration = {
  textfield: ['required', 'pattern', 'maxLength', 'plugins'],
  email: ['required', 'email'],
};

const buildValidationChain = (component: EditFormComponentSchema) => {
  const {type, key, validate = {}} = component;
  const validators = Object.keys(validate);
  if (!type || !key || !validators.length) {
    return null;
  }

  const schemaFactory = getZodPrimitiveFactory(type);
  let schema = schemaFactory() as z.ZodFirstPartySchemaTypes;

  const validatorNames = ValidatorConfiguration?.[type] || [];
  for (const name of validatorNames) {
    const configValue = validate[name];
    const builder = Validators[name];
    if (!builder) continue;
    schema = builder(schema, component, configValue);
  }

  // TODO -> certain component types (like file) always need to return an array
  // of the validation schema.
  const finalSchema = component.multiple ? schema.array() : schema;
  return finalSchema;
};

const buildZodSchema = (component: EditFormComponentSchema) => {
  const {type, key} = component;
  if (!type || !key) {
    return z.object({});
  }

  const componentSchema = buildValidationChain(component);
  let zodSchema = z.object(set({}, key, componentSchema));
  const isRequired = !!component?.validate?.required;
  if (!isRequired) {
    zodSchema = zodSchema.partial(set({}, key, true));
  }
  return zodSchema;
};

export default buildZodSchema;
