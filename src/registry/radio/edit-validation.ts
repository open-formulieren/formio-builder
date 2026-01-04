import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema, jsonSchema, optionSchema} from '@/registry/validation';

import {EditSchema} from '../types';

// z.object(...).or(z.object(...)) based on openForms.dataSrc doesn't seem to work,
// looks like the union validation only works if the discriminator is in the top level
// object :(
// so we mark each aspect as optional so that *when* it is provided, we can run the
// validation
const buildValuesSchema = (intl: IntlShape) =>
  z
    .object({
      values: optionSchema(intl).array().optional(),
      openForms: z.object({
        dataSrc: z.union([z.literal('manual'), z.literal('variable'), z.literal('referenceLists')]),
        // TODO: wire up infernologic type checking
        itemsExpression: jsonSchema.optional(),
        service: z.string().optional(),
        code: z.string().optional(),
      }),
    })
    .superRefine((component, ctx) => {
      // ensure at least one option is set for manual data source
      if (component?.openForms?.dataSrc === 'manual' && (component?.values ?? []).length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          path: ['values'],
          minimum: 1,
          inclusive: true,
          type: 'number',
        });
      }
      // validate the both service and table are selected when using reference lists
      else if (component?.openForms?.dataSrc === 'referenceLists') {
        const {service, code} = component.openForms;
        if (!service) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['openForms', 'service'],
            message: intl.formatMessage({
              description: 'Validation error for missing reference lists service',
              defaultMessage: 'You must select a service.',
            }),
          });
        }
        if (!code) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['openForms', 'code'],
            message: intl.formatMessage({
              description: 'Validation error for missing reference lists table',
              defaultMessage: 'You must select a table.',
            }),
          });
        }
      }
    });

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildValuesSchema(intl));

export default schema;
