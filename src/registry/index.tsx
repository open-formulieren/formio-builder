import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import BSN from './bsn';
import Currency from './currency';
import DateField from './date';
import DateTimeField from './datetime';
import Email from './email';
import Fallback from './fallback';
import FileUpload from './file';
import Iban from './iban';
import Licenseplate from './licenseplate';
import NumberField from './number';
import PhoneNumber from './phonenumber';
import Postcode from './postcode';
import Radio from './radio';
import Selectboxes from './selectboxes';
import Textarea from './textarea';
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
  textarea: Textarea,
  number: NumberField,
  date: DateField,
  datetime: DateTimeField,
  time: TimeField,
  phoneNumber: PhoneNumber,
  postcode: Postcode,
  file: FileUpload,
  selectboxes: Selectboxes,
  currency: Currency,
  radio: Radio,
  // Special types:
  iban: Iban,
  licenseplate: Licenseplate,
  bsn: BSN,
};

export {Fallback};
export default REGISTRY;
