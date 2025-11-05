import {CustomerProfileData} from '@open-formulieren/types';
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

  return z
    .object({})
    .passthrough()
    .superRefine((data, ctx) => {
      const {digitalAddressTypes, defaultValue} = data as {
        digitalAddressTypes: {email: boolean; phoneNumber: boolean};
        defaultValue: CustomerProfileData;
      };

      if (!digitalAddressTypes.email && !digitalAddressTypes.phoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: intl.formatMessage({
            description: 'Missing digital address types',
            defaultMessage: 'You must enable at least one digital address type.',
          }),
          path: ['digitalAddressTypes'],
        });
      }

      // Validate email if enabled
      if (digitalAddressTypes.email) {
        const emailResult = emailSchema.safeParse(defaultValue?.email?.address);
        if (!emailResult.success) {
          emailResult.error.issues.forEach(issue => {
            ctx.addIssue({
              ...issue,
              path: ['defaultValue', 'email', 'address'],
            });
          });
        }
      }

      // Validate phone number if enabled
      if (digitalAddressTypes.phoneNumber) {
        const phoneResult = phoneNumberSchema.safeParse(defaultValue?.phoneNumber?.address);
        if (!phoneResult.success) {
          phoneResult.error.issues.forEach(issue => {
            ctx.addIssue({
              ...issue,
              path: ['defaultValue', 'phoneNumber', 'address'],
            });
          });
        }
      }
    });
};

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
