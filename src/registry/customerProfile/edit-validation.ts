import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// We don't want to allow setting a default value for this component, since it's really user-specific
// and most often prefilled from the communication preferences prefill plugin.
// Null is allowed, as formio uses this as the "empty" value for undefined properties.
const defaultValueSchema = z.object({defaultValue: z.undefined().or(z.null())});

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
  buildCommonSchema(intl).and(defaultValueSchema).and(buildCustomerProfileSchema(intl));

export default schema;
