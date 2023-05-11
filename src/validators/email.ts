import {z} from 'zod';

import {OpenFormsComponentSchemaBase} from '@/types';

type TextBase = OpenFormsComponentSchemaBase<string>;

const Email = z.string().email();

const validator = (component: TextBase) => {
  const {key = 'OF_MISSING_KEY', multiple} = component;
  const schema = multiple ? Email.array() : Email;
  return {[key]: schema};
};

const getValidator = (component: TextBase, validatorValue: boolean) => {
  if (!validatorValue) return null;
  return validator(component);
};

export default getValidator;
