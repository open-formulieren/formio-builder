import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const imgSize = z.number().int().positive();

const ofSchema = z.object({
  image: z
    .object({
      resize: z
        .object({
          apply: z.boolean().optional(),
          width: imgSize.optional(),
          height: imgSize.optional(),
        })
        .optional(),
    })
    .optional(),
});

const buildFileMaxSizeSchema = (intl: IntlShape) =>
  z.string().refine(value => /^\d+\s*(B|KB|MB|GB)/i.test(value), {
    message: intl.formatMessage({
      description: "File component 'fileMaxSize' validation error",
      defaultMessage: 'Specify a positive, non-zero file size without decimals, e.g. 10MB.',
    }),
  });

const buildFileSchema = (intl: IntlShape) =>
  z.object({
    of: ofSchema.optional(),
    maxNumberOfFiles: z.union([z.null(), z.number().int().positive().optional()]),
    fileMaxSize: buildFileMaxSizeSchema(intl).optional(),
  });

/**
 * @todo implement validations:
 *
 * - validate fileMaxSize <= serverUploadLimit from context, if set. -> pass builder
 *   context by default to validator factory? we already pass the intl object so there's
 *   precedent...
 */

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(buildFileSchema(intl));

export default schema;
