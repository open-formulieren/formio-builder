import {merge} from 'lodash';
import type {IntlShape} from 'react-intl';

import type {ComponentGroup, NormalizedComponentConfiguration} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';

import {FORM_DESIGNER_PRESETS} from './constants';

/**
 * Normalize the component configurations for a given component group.
 */
export const normalizeComponentConfiguration = (
  group: ComponentGroup,
  intl: IntlShape
): NormalizedComponentConfiguration[] =>
  group.components.map<NormalizedComponentConfiguration>(componentType => {
    const {formDesigner, isDeprecated, builderInfo} = getRegistryEntry(componentType);

    return {
      key: componentType,
      label: intl.formatMessage(formDesigner.label),
      icon: builderInfo.icon,
      isDeprecated: isDeprecated,
      schema: builderInfo.schema,
    };
  });

export const getFullyQualifiedPresetConfiguration = (): NormalizedComponentConfiguration[] => {
  return FORM_DESIGNER_PRESETS.map<NormalizedComponentConfiguration>(presetConfiguration => {
    const {builderInfo} = getRegistryEntry(presetConfiguration.schema.type);
    const fullSchema = merge({}, builderInfo.schema, presetConfiguration.schema);
    return {
      ...presetConfiguration,
      schema: fullSchema,
    };
  });
};
