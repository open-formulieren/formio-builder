import {TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildCommonSchema} from '@/registry/validation';

const buildConfigurationSchema = (intl: IntlShape) =>
  z.object({
    defaultZoom: z.number().int().lte(TILE_LAYER_RD.maxZoom).gte(TILE_LAYER_RD.minZoom).optional(),
    initialCenter: z
      .object({
        lat: z.number().lte(90).gte(-90).optional(),
        lng: z.number().lte(180).gte(-180).optional(),
      })
      .superRefine((val, ctx) => {
        const bothMissing = val.lat == null && val.lng == null;
        const bothSet = val.lat != null && val.lng != null;
        if (bothMissing || bothSet) {
          return;
        }
        const missing = val.lat == null ? 'lat' : 'lng';
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: intl.formatMessage({
            description: 'Validation error for partial coordinates (lat, lng) configuration',
            defaultMessage: 'You need to configure both longitude and latitude.',
          }),
          path: [missing],
        });
      })
      .optional(),
  });

const buildMapSchema = (intl: IntlShape) =>
  z
    .object({
      useConfigDefaultMapSettings: z.literal(true),
      defaultZoom: z.undefined().or(z.null()),
      initialCenter: z.undefined(),
    })
    .or(
      z.object({useConfigDefaultMapSettings: z.literal(false)}).and(buildConfigurationSchema(intl))
    );

const schema = (intl: IntlShape) => buildCommonSchema(intl).and(buildMapSchema(intl));

export default schema;
