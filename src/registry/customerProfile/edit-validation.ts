import {DigitalAddressType} from '@open-formulieren/types';
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

const buildDigitalAddressSchema = (
  type: DigitalAddressType,
  addressSchema: z.ZodSchema
): z.ZodDiscriminatedUnionOption<'type'> =>
  z.strictObject({
    type: z.literal(type),
    address: addressSchema,
    useOnlyOnce: z.boolean().optional(),
    isNewPreferred: z.boolean().optional(),
  });

type DigitalAddressSchemaBuilder = (intl: IntlShape) => z.ZodDiscriminatedUnionOption<'type'>;

const buildEmailDigitalAddressSchema: DigitalAddressSchemaBuilder = intl =>
  buildDigitalAddressSchema(
    'email',
    z
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
      .optional()
  );

const buildPhoneNumberDigitalAddressSchema: DigitalAddressSchemaBuilder = intl =>
  buildDigitalAddressSchema(
    'phoneNumber',
    z
      .string()
      .regex(/^[+0-9][- 0-9]+$/, {
        message: intl.formatMessage(VALIDATION_MESSAGES.phoneNumber, {
          field: intl.formatMessage(LABELS.defaultValue),
        }),
      })
      .optional()
  );

// By defining the schema builders as a record, we can ensure all digitalAddressTypes are
// covered.
const digitalAddressTypeToSchemaBuilder: Record<DigitalAddressType, DigitalAddressSchemaBuilder> = {
  email: buildEmailDigitalAddressSchema,
  phoneNumber: buildPhoneNumberDigitalAddressSchema,
};

const buildDefaultValueSchema = (intl: IntlShape) => {
  // Zod discriminated union schema from a dynamic list of schemas has some issues.
  // Using type casting, we can get around the issue.
  const digitalAddressSchemas = Object.values(digitalAddressTypeToSchemaBuilder).map(
    schemaBuilder => schemaBuilder(intl)
  ) as [z.ZodDiscriminatedUnionOption<'type'>];

  return z.object({
    defaultValue: z.array(z.discriminatedUnion('type', digitalAddressSchemas)).optional(),
  });
};

const buildCustomerProfileSchema = (intl: IntlShape) =>
  z.object({
    shouldUpdateCustomerData: z.boolean(),
    digitalAddressTypes: z.array(z.enum(['email', 'phoneNumber'])).min(1, {
      message: intl.formatMessage({
        description: 'Validation error for zero digital address types selected',
        defaultMessage: 'At least one digital address type must be selected.',
      }),
    }),
  });

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).and(buildDefaultValueSchema(intl)).and(buildCustomerProfileSchema(intl));

export default schema;
