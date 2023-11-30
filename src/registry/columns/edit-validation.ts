import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildKeySchema} from '@/registry/validation';

const schema = (intl: IntlShape) =>
  z.object({
    key: buildKeySchema(intl),
  });

// TODO, add validations for:
// - sum of column widths <= 12
// - mobile column widths sum can exceed 4, as it wraps/goes into a different flow

export default schema;
