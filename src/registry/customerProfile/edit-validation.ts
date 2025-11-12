import {IntlShape, defineMessages} from 'react-intl';
import {z} from 'zod';

import {LABELS} from '@/components/builder/messages';
import {buildCommonSchema, getErrorMap, isInvalidStringIssue} from '@/registry/validation';

import {EditSchema} from '../types';

const VALIDATION_MESSAGES = defineMessages({
  email: {
    description: 'Invalid email address format validation error',
    defaultMessage: '{field} must be a valid email.',
  },
  phoneNumber: {
    description: 'Invalid phone number format validation error',
    defaultMessage: '{field} must be a valid phone number.',
  },
});

const buildDefaultValueSchema = (intl: IntlShape) => {
  const phoneNumberSchema = z
    .string()
    .regex(/^[+0-9][- 0-9]+$/, {
      message: intl.formatMessage(VALIDATION_MESSAGES.phoneNumber, {
        field: intl.formatMessage(LABELS.defaultValue),
      }),
    })
    .optional();
  const emailSchema = z
    .string({
      errorMap: getErrorMap(issue => {
        if (isInvalidStringIssue(issue) && issue.validation === 'email') {
          const fieldLabel = intl.formatMessage(LABELS.defaultValue);
          return intl.formatMessage(VALIDATION_MESSAGES.email, {field: fieldLabel});
        }
        return;
      }),
    })
    .email()
    .optional();

  const emailDigitalAddressSchema = z.object({
    type: z.literal('email'),
    address: emailSchema,
  });

  const phoneNumberDigitalAddressSchema = z.object({
    type: z.literal('phoneNumber'),
    address: phoneNumberSchema,
  });

  const digitalAddressSchema = z
    .object({
      useOnlyOnce: z.boolean().optional(),
      isNewPreferred: z.boolean().optional(),
    })
    .and(phoneNumberDigitalAddressSchema.or(emailDigitalAddressSchema));

  const defaultValue = z.array(digitalAddressSchema).optional();

  return z.object({defaultValue});
};

const customerProfileSchema = z.object({
  shouldUpdateCustomerData: z.boolean(),
  digitalAddressTypes: z.array(z.enum(['email', 'phoneNumber'])).min(1),
});

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(buildDefaultValueSchema(intl)).and(customerProfileSchema);

export default schema;
