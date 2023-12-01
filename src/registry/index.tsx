import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import AddressNL from './addressNL';
import BSN from './bsn';
import Checkbox from './checkbox';
import Columns from './columns';
import Currency from './currency';
import DateField from './date';
import DateTimeField from './datetime';
import Email from './email';
import Fallback from './fallback';
import FieldSet from './fieldset';
import FileUpload from './file';
import Iban from './iban';
import Licenseplate from './licenseplate';
import NpFamilyMembers from './npFamilyMembers';
import NumberField from './number';
import PhoneNumber from './phonenumber';
import Postcode from './postcode';
import Radio from './radio';
import Select from './select';
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
  date: DateField,
  datetime: DateTimeField,
  time: TimeField,
  phoneNumber: PhoneNumber,
  postcode: Postcode,
  file: FileUpload,
  textarea: Textarea,
  number: NumberField,
  checkbox: Checkbox,
  selectboxes: Selectboxes,
  select: Select,
  currency: Currency,
  radio: Radio,
  // Special types:
  iban: Iban,
  licenseplate: Licenseplate,
  bsn: BSN,
  npFamilyMembers: NpFamilyMembers,
  addressNL: AddressNL,
  // layout
  columns: Columns,
  fieldset: FieldSet,
};

export {Fallback};
export default REGISTRY;
