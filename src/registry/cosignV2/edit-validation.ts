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

  return z.object({defaultValue: emailSchema});
};

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
