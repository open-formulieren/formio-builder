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
});

const buildDefaultValueSchema = (intl: IntlShape) => {
  const cosignV2Schema = z.object({
    email: z
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
      .optional(),
    // Not guaranteed to be a valid BSN, but the default value field is not exposed to the designer
    bsn: z
      .string()
      .regex(/^[0-9]{9}/)
      .optional(),
  });

  return z.object({defaultValue: cosignV2Schema});
};

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
