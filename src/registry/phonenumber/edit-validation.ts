import {defineMessage} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

const PHONE_NUMBER_INVALID_MESSAGE = defineMessage({
  description: 'Validation error for phone number format.',
  defaultMessage:
    'Invalid phone number - a phone number may only contain digits, the + or - sign or spaces',
});

const schema: EditSchema = ({intl}) => {
  const singleValueSchema = z.string().regex(/^[+0-9][- 0-9]+$/, {
    message: intl.formatMessage(PHONE_NUMBER_INVALID_MESSAGE),
  });

  const defaultValue = z.union([singleValueSchema, z.array(singleValueSchema)]).optional();

  return buildCommonSchema(intl).extend({defaultValue});
};

export default schema;
