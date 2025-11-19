import {z} from 'zod';

import {LABELS} from '@/components/builder/messages';
import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

const phoneRegex = /^[+0-9][- 0-9]+$/;

const defaultValueSchema = (intl: any) =>
  z.preprocess(
    val => (val === '' ? undefined : val),
    z.union([
      z.string().regex(phoneRegex, {
        message: intl.formatMessage(
          {
            description: 'Invalid phone number format validation error',
            defaultMessage: '{field} must be a valid phone number.',
          },
          {field: intl.formatMessage(LABELS.defaultValue)}
        ),
      }),
      z.array(z.string().regex(phoneRegex)),
    ])
  );

const schema: EditSchema = ({intl}) =>
  buildCommonSchema(intl).extend({defaultValue: defaultValueSchema(intl).optional()});

export default schema;
