import type {IntlShape} from 'react-intl';

import type {ComponentGroup, NormalizedComponentDefinition} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';

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
