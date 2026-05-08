import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {BuilderContextType} from '@/context';
import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// Reference: formio's file component translateScalars method, but without the weird
// units that don't make sense for files...
const TRANSFORMATIONS = {
  B: Math.pow(1024, 0),
  KB: Math.pow(1024, 1),
  MB: Math.pow(1024, 2),
  GB: Math.pow(1024, 3),
};

const getSizeInBytes = (filesize: string): number | null => {
  const match = /^(\d+)\s*(B|KB|MB|GB)?$/i.exec(filesize);
  if (match === null) {
    return null;
  }
  const size = parseInt(match[1], 10);
  const unit = (match[2] || 'B').toUpperCase() as keyof typeof TRANSFORMATIONS;
  return size * TRANSFORMATIONS[unit];
};

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

const buildFileMaxSizeSchema = (intl: IntlShape, builderContext: BuilderContextType) => {
  const {serverUploadLimit} = builderContext;
  const serverLimitInBytes = getSizeInBytes(serverUploadLimit) ?? Number.MAX_SAFE_INTEGER;
  return z
    .string()
    .transform((val, ctx) => {
      const sizeInBytes = getSizeInBytes(val);
      if (sizeInBytes === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: intl.formatMessage({
            description: "File component 'fileMaxSize' validation error",
            defaultMessage: 'Specify a positive, non-zero file size without decimals, e.g. 10MB.',
          }),
        });
        return z.NEVER;
      }
      return sizeInBytes;
    })
    .refine(value => value <= serverLimitInBytes, {
      message: intl.formatMessage({
        description: "File component 'fileMaxSize' greater than server limit",
        defaultMessage: 'Specify a file size less than or equal to the server upload limit.',
      }),
    });
};

const buildRegistrationSchema = (intl: IntlShape) =>
  z.object({
    documentType: z
      .object({
        catalogue: z.object({
          domain: z.string().optional(),
          rsin: z.string().optional(),
        }),
        description: z.string().optional(),
      })
      .optional()
      .superRefine((documentType, ctx) => {
        const hasAnyProperty =
          !!documentType?.description ||
          !!documentType?.catalogue.domain ||
          !!documentType?.catalogue.rsin;
        if (hasAnyProperty) {
          if (!documentType.description) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: intl.formatMessage({
                description:
                  'File registration validation error for missing document type description',
                defaultMessage:
                  'You must specify a document type description when a catalogue is configured.',
              }),
              path: ['description'],
            });
          }
          if (!documentType?.catalogue.domain) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: intl.formatMessage({
                description:
                  'File registration validation error for missing catalogue domain or RSIN',
                defaultMessage: 'You must specify both domain and RSIN.',
              }),
              path: ['catalogue', 'domain'],
            });
          }
          if (!documentType?.catalogue.rsin) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: intl.formatMessage({
                description:
                  'File registration validation error for missing catalogue rsin or RSIN',
                defaultMessage: 'You must specify both domain and RSIN.',
              }),
              path: ['catalogue', 'rsin'],
            });
          } else if (!/^[0-9]{9}$/.test(documentType.catalogue.rsin)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: intl.formatMessage({
                description: 'File registration validation error for invalid RSIN pattern',
                defaultMessage: 'The RSIN must consist of 9 numbers.',
              }),
              path: ['catalogue', 'rsin'],
            });
          }
        }
      }),
  });

const buildFileSchema = (intl: IntlShape, builderContext: BuilderContextType) =>
  z.object({
    of: ofSchema.optional(),
    maxNumberOfFiles: z.union([z.null(), z.number().int().positive().optional()]),
    fileMaxSize: buildFileMaxSizeSchema(intl, builderContext).optional(),
    registration: buildRegistrationSchema(intl).optional(),
  });

const schema: EditSchema = ({intl, builderContext}) => {
  const common = buildCommonSchema(intl);
  const fileSpecific = buildFileSchema(intl, builderContext);
  return common.and(fileSpecific);
};

export default schema;
