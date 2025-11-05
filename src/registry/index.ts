import type {AnyComponentSchema, FallbackSchema} from '@open-formulieren/types';

import {hasOwnProperty} from '@/types';

import AddressNL from './addressNL';
import BSN from './bsn';
import Checkbox from './checkbox';
import Children from './children';
import Columns from './columns';
import Content from './content';
import CosignV1 from './cosignV1';
import CosignV2 from './cosignV2';
import Currency from './currency';
import CustomerProfile from './customerProfile';
import DateField from './date';
import DateTimeField from './datetime';
import EditGrid from './editgrid';
import Email from './email';
import FieldSet from './fieldset';
import FileUpload from './file';
import Iban from './iban';
import Licenseplate from './licenseplate';
import LeafletMap from './map';
import NpFamilyMembers from './npFamilyMembers';
import NumberField from './number';
import Partners from './partners';
import PhoneNumber from './phonenumber';
import Postcode from './postcode';
import ProductPrice from './productPrice';
import Radio from './radio';
import Select from './select';
import Selectboxes from './selectboxes';
import Signature from './signature';
import SoftRequiredErrors from './softRequiredErrors';
import Textarea from './textarea';
import TextField from './textfield';
import TimeField from './time';
import {Registry, RegistryEntry} from './types';

/**
 * Type guard to determine if the passed in 'component' is something we have type
 * definitions for.
 *
 * Use this check as high as possible, so that all other child components and
 * functionality do not need to worry about `FallbackSchema`.
 */
export const isKnownComponentType = (
  component: AnyComponentSchema | FallbackSchema
): component is AnyComponentSchema => {
  return Boolean(component.type && hasOwnProperty(REGISTRY, component.type));
};

export const getRegistryEntry = (
  component: AnyComponentSchema
): RegistryEntry<AnyComponentSchema> => {
  const entry = REGISTRY[component.type];
  return entry;
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
  signature: Signature,
  cosign: CosignV2,
  addressNL: AddressNL,
  map: LeafletMap,
  editgrid: EditGrid,
  partners: Partners,
  children: Children,
  customerProfile: CustomerProfile,
  // layout
  content: Content,
  columns: Columns,
  fieldset: FieldSet,
  softRequiredErrors: SoftRequiredErrors,
  // deprecated
  coSign: CosignV1,
  productPrice: ProductPrice,
};

export default REGISTRY;
