import type {IntlShape} from 'react-intl';

import {getRegistryEntry} from '@/registry';

import type {ComponentGroup, NormalizedComponentDefinition} from '../types';

/**
 * Normalize the component definitions for a given component group.
 */
export const normalizeComponentDefinition = (group: ComponentGroup, intl: IntlShape) =>
  group.components.map<NormalizedComponentDefinition>(componentType => {
    const {formDesigner, isDeprecated, builderInfo} = getRegistryEntry(componentType);

    return {
      key: componentType,
      label: intl.formatMessage(formDesigner.label),
      icon: builderInfo.icon,
      isDeprecated: isDeprecated,
      schema: builderInfo.schema,
    };
  });
