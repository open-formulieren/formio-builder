import { defineMessage, type IntlShape } from 'react-intl';
import { z } from 'zod';

import { buildCommonSchema } from '@/registry/validation';

import { EditSchema } from '../types';

const PHONE_NUMBER_INVALID_MESSAGE = defineMessage({
  description: 'Validation error for phone number format.',
  defaultMessage:
    'Invalid phone number - a phone number may only contain digits, the + or - sign or spaces',
});

const buildDefaultValueSchema = (intl: IntlShape) => {
  const phoneNumberSchema = z
    .string()
    .regex(/^[+0-9][- 0-9]+$/, {
      message: intl.formatMessage(PHONE_NUMBER_INVALID_MESSAGE),
    })
    .optional();

  // case for when component.multiple = false
  const singleValueSchema = z
    .object({ multiple: z.literal(false) })
    .and(z.object({ defaultValue: phoneNumberSchema }));

  // case for when component.multiple = true
  const multipleValueSchema = z
    .object({ multiple: z.literal(true) })
    .and(z.object({ defaultValue: phoneNumberSchema.array() }));

  return singleValueSchema.or(multipleValueSchema);
};

const schema: EditSchema = ({ intl }) =>
  buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
