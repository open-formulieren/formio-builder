import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import Currency from './currency';
import DateField from './date';
import DateTimeField from './datetime';
import Email from './email';
import Fallback from './fallback';
import FileUpload from './file';
import NumberField from './number';
import PhoneNumber from './phonenumber';
import Postcode from './postcode';
import TextField from './textfield';
import TimeField from './time';
import {Registry, RegistryEntry} from './types';

export const isKnownComponentType = (
  component: AnyComponentSchema | FallbackSchema
): component is AnyComponentSchema => {
  return Boolean(component.type && hasOwnProperty(REGISTRY, component.type));
};

export const getRegistryEntry = <S extends AnyComponentSchema | FallbackSchema>(component: S) => {
  if (isKnownComponentType(component)) {
    const entry = REGISTRY[component.type];
    return entry as RegistryEntry<AnyComponentSchema>;
  }
  return Fallback;
};

const REGISTRY: Registry = {
  textfield: TextField,
  email: Email,
  number: NumberField,
  date: DateField,
  datetime: DateTimeField,
  time: TimeField,
  phoneNumber: PhoneNumber,
  postcode: Postcode,
  file: FileUpload,
  currency: Currency,
};

export {Fallback};
export default REGISTRY;
