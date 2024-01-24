import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

const buildTime24hSchema = (intl: IntlShape) =>
  z.string().refine(
    value => {
      const time24hFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return time24hFormat.test(value);
    },
    {
      message: intl.formatMessage({
        description: 'Error message for invalid 24h time input',
        defaultMessage: 'The time must a valid time in the HH:mm format.',
      }),
    }
  );

const buildOptionalTimeSchema = (intl: IntlShape) =>
  z.union([
    buildTime24hSchema(intl),
    z.literal(''),
    z.undefined(), // formik (deliberately) turns empty string into undefined
    z.null(),
  ]);

// case for when component.multiple=false
const buildSingleValueSchema = (intl: IntlShape) =>
  z
    .object({multiple: z.literal(false)})
    .and(z.object({defaultValue: buildOptionalTimeSchema(intl)}));

// case for when component.multiple=true
const buildMultipleValueSchema = (intl: IntlShape) =>
  z
    .object({multiple: z.literal(true)})
    .and(z.object({defaultValue: buildOptionalTimeSchema(intl).array()}));

const buildTimeSpecific = (intl: IntlShape) =>
  z.object({
    validate: z
      .object({
        minTime: buildOptionalTimeSchema(intl),
        maxTime: buildOptionalTimeSchema(intl),
      })
      .optional(),
  });

const schema: EditSchema = ({intl}) => {
  const commonSchema = buildCommonSchema(intl);
  const defaultValueSchema = buildSingleValueSchema(intl).or(buildMultipleValueSchema(intl));
  return commonSchema.and(defaultValueSchema).and(buildTimeSpecific(intl));
};

export default schema;
