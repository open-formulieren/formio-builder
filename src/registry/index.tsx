import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import DateField from './date';
import Email from './email';
import Fallback from './fallback';
import NumberField from './number';
import TextField from './textfield';
import {Registry, RegistryEntry} from './types';

export const isKnownComponentType = (
  component: AnyComponentSchema | FallbackSchema
): component is AnyComponentSchema => {
  return Boolean(component.type && hasOwnProperty(REGISTRY, component.type));
};

export const getRegistryEntry = <S extends AnyComponentSchema | FallbackSchema>(component: S) => {
  if (isKnownComponentType(component)) {
    const entry = REGISTRY[component.type];
    return entry as RegistryEntry<S>;
  }
  return Fallback;
};

const REGISTRY: Registry = {
  textfield: TextField,
  email: Email,
  number: NumberField,
  date: DateField,
};

export default REGISTRY;
