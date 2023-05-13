import {IntlShape, defineMessages} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema, getErrorMap, isInvalidStringIssue} from '@/registry/validation';

const VALIDATION_MESSAGES = defineMessages({
  email: {
    description: 'Invalid email address format validation error',
    defaultMessage: '{field} must be a valid email.',
  },
});

const buildDefaultValueSchema = (intl: IntlShape) => {
  const emailSchema = z
    .string({
      errorMap: getErrorMap(issue => {
        if (isInvalidStringIssue(issue) && issue.validation === 'email') {
          // TODO: get the field label from builder localised label!
          return intl.formatMessage(VALIDATION_MESSAGES.email, {field: 'Default Value'});
        }
        return;
      }),
    })
    .email()
    .optional();

  // case for when component.multiple=false
  const singleValueSchema = z
    .object({multiple: z.literal(false)})
    .and(z.object({defaultValue: emailSchema}));

  // case for when component.multiple=true
  const multipleValueSchema = z
    .object({multiple: z.literal(true)})
    .and(z.object({defaultValue: emailSchema.array()}));

  return singleValueSchema.or(multipleValueSchema);
};

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
