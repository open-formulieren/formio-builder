import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildKeySchema} from '@/registry/validation';

const buildColumnsSchema = (intl: IntlShape) =>
  z
    .array(
      z.object({
        size: z.number().int().gte(1).lte(12),
        sizeMobile: z.number().int().gte(1).lte(4),
      })
    )
    // Check that the total columns does not exceed 12, as that would cause column wrapping.
    // While the CSS itself can handle the wrapping, it's best to avoid it and instead
    // explicitly design your rows in your form by using multiple column components.
    // Note that this restricting does not apply to mobile viewports, since there we
    // deliberate use less columns and leverage wrapping onto the next row for a friendlier
    // layout.
    .refine(
      cols => {
        const totalSize = cols.reduce((acc, curVal) => acc + curVal.size, 0);
        return totalSize <= 12;
      },
      {
        message: intl.formatMessage({
          description: 'Validation error for column sizes exceeding total value of 12',
          defaultMessage: 'The sum of column sizes may not exceed 12.',
        }),
      }
    );

const schema = (intl: IntlShape) =>
  z.object({
    key: buildKeySchema(intl),
    columns: buildColumnsSchema(intl),
  });

export default schema;
