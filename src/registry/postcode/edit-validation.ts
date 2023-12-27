import {IntlShape, defineMessages} from 'react-intl';
import {z} from 'zod';

import {LABELS} from '@/components/builder/messages';
import {buildCommonSchema, getErrorMap, isInvalidStringIssue} from '@/registry/validation';

import {EditSchema} from '../types';
import {POSTCODE_REGEX} from './constants';

const VALIDATION_MESSAGES = defineMessages({
  postcode: {
    description: 'Invalid postcode format validation error',
    defaultMessage: '{field} must be a valid postcode.',
  },
});

const buildDefaultValueSchema = (intl: IntlShape) => {
  const postcodeSchema = z
    .string({
      errorMap: getErrorMap(issue => {
        if (isInvalidStringIssue(issue) && issue.validation === 'regex') {
          const fieldLabel = intl.formatMessage(LABELS.defaultValue);
          return intl.formatMessage(VALIDATION_MESSAGES.postcode, {field: fieldLabel});
        }
        return;
      }),
    })
    .regex(new RegExp(POSTCODE_REGEX))
    .optional();

  // case for when component.multiple=false
  const singleValueSchema = z
    .object({multiple: z.literal(false)})
    .and(z.object({defaultValue: postcodeSchema}));

  // case for when component.multiple=true
  const multipleValueSchema = z
    .object({multiple: z.literal(true)})
    .and(z.object({defaultValue: postcodeSchema.array()}));

  return singleValueSchema.or(multipleValueSchema);
};

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildDefaultValueSchema(intl));

export default schema;
